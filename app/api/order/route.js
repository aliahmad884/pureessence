const { res } = require('../syntaxShorter.js')
const { Order } = require("../schemas.js")
import { where } from "sequelize";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req) {
    // const accessToken = req.cookies.get('token')?.value;
    // if (!accessToken) return res({ res: "Unauthorized! no token provided" }, 401)
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')
    const order = searchParams.get('orderStatus')
    const user = searchParams.get('user')
    try {
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
        return res({ res: 'Internal Server Error!' }, 500)
    }
}

export async function POST(req) {
    const { searchParams } = new URL(req.url)
    const body = await req.json()
    const paramId = searchParams.get('paymentIntentId')
    try {
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
        return res({ res: 'Internal Server Error!' }, 500)
    }
}