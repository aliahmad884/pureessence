const { res } = require('../syntaxShorter.js')
const { Order, Invoice } = require("../schemas.js")
import nodemailer from "nodemailer";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req) {
    // const accessToken = req.cookies.get('token')?.value;
    // if (!accessToken) return res({ res: "Unauthorized! no token provided" }, 401)
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')
    const invId = searchParams.get('invId')
    const order = searchParams.get('orderStatus')
    const user = searchParams.get('user')
    try {
        if (invId) {
            const found = await Invoice.findOne({ where: { id: invId } })
            if (found) {
                let data = found.dataValues
                return res({ data }, 200)
            }
            return res({ res: 'Invoice not found!' }, 404)
        }
        if (orderNumber) {
            const found = await Order.findOne({ where: { id: orderNumber } })
            if (found) {
                let data = found.dataValues
                return res({ data }, 200)
            }
            return res({ res: 'Order details not found!' }, 404)
        }
        const orders = await Order.findAll({ where: { orderType: order, userId: user } });
        if (order) {
            const data = orders.map(data => data.dataValues)
            return res({ data }, 200)
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
            const { cartData, ...billInfo } = body
            const newInvoice = await Invoice.create({
                billing: billInfo,
                items: cartData,
                date: new Date()
            })
            const invoiceId = newInvoice.dataValues.id;

            // ------------ Email Section ---------------

            const clientOptions = {
                from: 'Admin@PurEssence <data@puressenceltd.co.uk>',
                to: billInfo.email,
                subject: 'Order Confirmation',
                html: `<p>Hello pa g ma spam nahi hon</p>`
            }
            let clientInfo = await transporter.sendMail(clientOptions)
            console.log(clientInfo.messageId)

            const adminOptions = {
                from: 'Admin@PurEssence <data@puressenceltd.co.uk>',
                to: 'data@puressenceltd.co.uk',
                subject: 'Order Placed',
                html: `<p>Hello pa g ma spam nahi hon</p>`
            }
            let adminInfo = await transporter.sendMail(adminOptions)
            console.log(adminInfo.messageId)

            // ------------ Response Return ---------------

            return res({ res: "Request recieved", invoiceId: invoiceId }, 200)
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