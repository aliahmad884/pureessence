const { res, randomeStrGen } = require('../syntaxShorter.js')
import nodemailer from "nodemailer";
import Stripe from "stripe";
import { Order, Invoice } from "../schemas.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req) {
    // const accessToken = req.cookies.get('token')?.value;
    // if (!accessToken) return res({ res: "Unauthorized! no token provided" }, 401)
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')
    const invId = searchParams.get('invId')
    const invUrl = searchParams.get('ul')
    const order = searchParams.get('orderStatus')
    const user = searchParams.get('user')
    try {
        if (invId && invUrl) {
            const found = await Invoice.findOne({ where: { id: invId, uniquUrl: invUrl } })
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
            let randomStr = randomeStrGen(11)
            console.log(randomStr)
            const newInvoice = await Invoice.create({
                uniquUrl: randomStr,
                billing: billInfo,
                items: cartData,
                date: new Date()
            })
            const invoice = newInvoice.dataValues;


            // ------------ Email Section ---------------

            const clientOptions = {
                from: 'Admin@PurEssence <data@puressenceltd.co.uk>',
                to: billInfo.email,
                subject: 'Order Confirmation',
                html: `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                            <a href="https://puressenceltd.co.uk"> <img src="https://puressenceltd.co.uk/logos/PE-Main-Logo.png"
                            alt="Logo"></a>
                            <h1>Order confirmation from <strong>PurEssence LTD</strong></h1>
                            <h3>Dear ${billInfo.firstName},</h3>
                            <p>Thank you for placing an order with <strong>PurEssence LTD</strong>. We are pleased to confirm
                                the invoice of your order PE-INV-000${invoice.id}.
                            </p>
                            <p>
                                Your order is now being processing and we will contact you as soon as possible. You will receive a notification
                                once your order has been shipped. We appreciate the trust you have placed in us and aim to provide you with the highest quality of service.
                                If you have any questions or need further assistance, please do not hesitate to contact our customer service team at
                                <strong><a href="mailto:info@puressenceltd.co.uk">info@puressenceltd.co.uk</a></strong> or contact on <strong><a href="https://wa.me/+4401254411076">WhatsApp</a></strong>. Thank you for choosing <strong>PurEssence LTD</strong>. We value your 
                                business and look forward to serving you again.
                            </p>
                            <p>To see invoice, <a href="https://puressenceltd.co.uk/invoice?invId=${invoice.id}&ul=${invoice.uniquUrl}">Click</a></p>
                            <h4>Warm regards,</h4>
                            <p> PurEssence LTD.</p>
                    </div>`
            }
            let clientInfo = await transporter.sendMail(clientOptions)
            console.log(clientInfo.messageId)

            const adminOptions = {
                from: 'Admin@PurEssence <data@puressenceltd.co.uk>',
                to: 'alilatakhun2003@gmail.com',
                subject: 'New Order Placed',
                html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <h1>Order placed by <strong>${billInfo.firstName} ${billInfo.lastName}</strong></h1>
                    <h2>Client Email: ${billInfo.email}</h2>
                    <h2>Client Phone: ${billInfo.phone}</h2>
                    <h2>Shipping Address: ${billInfo.address}</h2>
                    <h2>Invoice: PE-INV-000${invoice.id}</h2>
                    <h3>Date & Time: ${new Date(invoice.date).toDateString()} ${new Date(invoice.date).toLocaleTimeString()}</h3>
                    <p>To see invoice, <a href="https://puressenceltd.co.uk/invoice?invId=${invoice.id}&ul=${invoice.uniquUrl}">Click</a></p>
            </div>`
            }
            let adminInfo = await transporter.sendMail(adminOptions)
            console.log(adminInfo.messageId)

            // ------------ Response Return ---------------

            return res({ res: "Request recieved", invId: invoice.id, invUrl: invoice.uniquUrl }, 200)
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
