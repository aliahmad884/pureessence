const { res, randomeStrGen } = require('../syntaxShorter.js')
import nodemailer from "nodemailer";
import Stripe from "stripe";
import { Order, Invoice } from "../schemas.js";
import { ordConfirm, ordPlacedNotify } from "../mailTemplates.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req) {
    // const accessToken = req.cookies.get('token')?.value;
    // if (!accessToken) return res({ res: "Unauthorized! no token provided" }, 401)
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')
    const invId = searchParams.get('invId')
    const invUrl = searchParams.get('ul')
    const orderStatus = searchParams.get('orderStatus')
    const userId = searchParams.get('user')
    try {
        if (invId && invUrl) {
            const found = await Invoice.findOne({ where: { id: invId, uniquUrl: invUrl } })
            if (found) {
                let data = found.dataValues
                return res({ data }, 200)
            }
            return res({ res: 'Invoice not found!' }, 404)
        }
        else if (orderNumber) {
            if (userId) {
                const foundwithId = await Order.findOne({ where: { id: orderNumber, userId: userId } })
                if (foundwithId) {
                    let data = foundwithId.dataValues
                    return res({ data }, 200)
                }
                return res({ res: 'Order details not found!' }, 404)
            }
            else {
                const found = await Order.findOne({ where: { id: orderNumber } })
                if (found) {
                    let data = found.dataValues
                    return res({ data }, 200)
                }
                return res({ res: 'Order details not found!' }, 404)
            }
        }
        else if (orderStatus) {
            const orders = await Order.findAll({ where: { userId: userId } });
            const data = orders.map(data => data.dataValues)
            return res({ data }, 200)
        }
        else {
            console.log('api called')
            const allOrders = await Order.findAll()
            const data = allOrders.map(data => data.dataValues)
            return res(data, 200)
        }
    }
    catch (err) {
        console.log(err)
        return res({ res: 'Internal Server Error!', err: err }, 500)
    }
}

export async function POST(req) {
    const { searchParams } = new URL(req.url)
    const body = await req.json()
    const reqtyp = searchParams.get('reqTyp')
    const paramId = searchParams.get('paymentIntentId')

    let transporter = nodemailer.createTransport({
        host: 'smtp.ionos.co.uk',
        port: 465,
        secure: true,
        auth: {
            user: 'data@puressenceltd.co.uk',
            pass: 'Lqv39KGQ6NUQ!_#',
        },
    })

    try {
        if (reqtyp === 'invoice') {
            const { cartData, subTotal, discount, shipFee, userId, ...billInfo } = body;
            let randomStr = randomeStrGen(11)
            // console.log(randomStr)
            const transaction = await Invoice.sequelize.transaction()
            const newInvoice = await Invoice.create({
                orderId: null,
                uniquUrl: randomStr,
                billing: billInfo,
                items: cartData,
                date: new Date(),
                total: (subTotal - discount) + shipFee,
                shipFee: shipFee,
                discount: discount
            },
                { transaction }
            )
            const invoice = newInvoice.dataValues;
            const newOrder = await Order.create({
                userId: userId,
                product: cartData,
                totalAmount: (subTotal - discount) + shipFee,
                orderDate: new Date(),
                paymentMethod: null,
                shippingDetails: billInfo,
                orderType: null,
                orderStatus: 'Processing',
                invLink: `/invoice?invId=${invoice.id}&ul=${invoice.uniquUrl}`,
                invId: invoice.id,
                shipFee: shipFee,
                discount: discount
            },
                { transaction }
            )
            await Invoice.update({ orderId: newOrder.dataValues.id }, { where: { id: invoice.id }, transaction })
            await transaction.commit()

            // ------------ Email Section ---------------

            const clientOptions = {
                from: 'Admin@PurEssence <data@puressenceltd.co.uk>',
                to: billInfo.email,
                subject: 'Order Confirmation',
                html: ordConfirm(billInfo, invoice)
            }
            let clientInfo = await transporter.sendMail(clientOptions)
            console.log(clientInfo.messageId)

            const adminOptions = {
                from: 'Admin@PurEssence <data@puressenceltd.co.uk>',
                to: process.env.ADMIN_MAIL,
                subject: 'New Order Placed',
                html: ordPlacedNotify(billInfo, invoice)
            }
            let adminInfo = await transporter.sendMail(adminOptions)
            console.log(adminInfo.messageId)

            // ------------ Response Return ---------------

            return res({ res: "Order Completed successfully", invId: invoice.id, invUrl: invoice.uniquUrl }, 200)
        }
        let paymentId = (await stripe.paymentIntents.retrieve(paramId ? paramId : 'pi_3Q403YRqfkkgc0Q105cLWt8C')).payment_method
        let payment_method = await stripe.paymentMethods.retrieve(paymentId)
        const { total, ...data } = body.info
        await Order.create({
            userId: data.email,
            product: body.products,
            totalAmount: total / 100,
            orderDate: new Date().toLocaleString(),
            paymentMethod: payment_method.type,
            shippingDetails: data,
            orderType: 'Successfull',
            orderStatus: 'Proccessing'
        })
        return res({ res: 'Order Created Successfully!' }, 200)
    }
    catch (err) {
        console.log(err)
        return res({ res: 'Internal Server Error!', serverError: err }, 500)
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')
    try {
        const findOrd = await Order.findOne({ where: { id: orderId } })
        const findInv = await Invoice.findOne({ where: { orderId: orderId } })
        await findOrd.destroy()
        await findInv.destroy()
        return res({ res: 'Order Deleted' }, 201)
    }
    catch (err) {
        console.log(err)
        return res({ res: 'Internal Server Error!', err: err }, 500)
    }
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')
    const status = searchParams.get('status')
    try {
        const findOrd = await Order.findOne({ where: { id: orderId } })
        await findOrd.update({ orderStatus: status })
        // await findOrd.update
        return res({ res: 'Status Updated' }, 201)
    }
    catch (err) {
        console.log(err)
        return res({ res: 'Internal Server Error!', err: err }, 500)
    }
}
