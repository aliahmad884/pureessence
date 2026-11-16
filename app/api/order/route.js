import { res, randomeStrGen, getUserToken, getAdminToken } from '../syntaxShorter.js';
import nodemailer from "nodemailer";
import { Order, Invoice, Product } from "../schemas.js";
import { cancelOrd, ordcancelConfirm, ordConfirm, ordPlacedNotify } from "../mailTemplates.js";
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { randomBytes } from "crypto";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export function generateOrderId() {
    return `ORD-${randomBytes(4).toString("hex").toUpperCase()}`;
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS,
    },
})


export async function GET(req) {
    const userInfo = await getUserToken(req);
    const adminInfo = await getAdminToken(req);
    const { searchParams } = new URL(req.url)
    const scope = searchParams.get("scope")
    const order_id = searchParams.get('order_id')
    try {
        if (userInfo && scope === "customer") {
            const orders = await Order.findAll({ where: { userId: userInfo?.id } })
            const orderData = orders.map(d => d.dataValues);
            return NextResponse.json({ data: orderData }, { status: 200 })
        }
        else if (order_id) {
            const order = await Order.findOne({ where: { order_id: order_id } })
            if (!order) return NextResponse.json({ res: "No Order found!" }, { status: 404 });
            return NextResponse.json({ data: order.dataValues }, { status: 200 });
        }
        else if (adminInfo) {
            console.log("Admin Token Found")
            const allOrders = await Order.findAll()
            const data = allOrders.map(data => data.dataValues)
            return res(data, 200)
        }
        return NextResponse.json({ res: "Unauthorized..." }, { status: 401 });
    }
    catch (err) {
        console.log(err)
        return res({ res: 'Internal Server Error!', err: err }, 500)
    }
}

export async function POST(req) {
    const userInfo = await getUserToken(req);
    const { searchParams } = new URL(req.url);
    const body = await req.json();

    try {
        const { cartData, ...billInfo } = body;

        const ids = cartData.map((i) => i.id);
        const products = await Product.findAll({
            where: { id: ids },
            attributes: ['id', "pName", "qty", "slug", "price", "sDesc", "pImages"]
        });
        const byId = new Map(products.map((p) => [p.id, p]));

        const lines = cartData.map((i) => {
            const p = byId.get(i.id);
            if (!p) throw new Error('Invalid product');
            return {
                product: p,
                qty: Math.max(1, parseInt(i.qty, 10)),
                unitPence: Math.round(Number(p.price) * 100),
            };
        });

        const totalPence = lines.reduce((sum, l) => sum + l.unitPence * l.qty, 0);
        const toPounds = (pence) => (pence / 100).toFixed(2);



        const order_id = generateOrderId();
        const order = await Order.create({
            userId: userInfo?.id ?? null,
            order_id,
            product: products,
            totalAmount: toPounds(totalPence),
            shipFee: 0,
            discount: 0,
            orderDate: new Date(),
            paymentMethod: 'stripe',
            orderType: 'online',
            orderStatus: 'Pending',
            payment: 'Pending',
            shippingDetails: billInfo,
            invId: null,
            invLink: null,
            stripeSessionId: null,
            stripePaymentIntentId: null,
            paidAt: null,
        });

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lines.map((l) => ({
                price_data: {
                    currency: 'gbp',
                    unit_amount: l.unitPence,
                    product_data: { name: l.product.pName },
                },
                quantity: l.qty,
            })),
            client_reference_id: order_id,
            customer_email: billInfo.email,
            metadata: { order_id },
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order_id}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        }, { idempotencyKey: `order-${order_id}` });

        await order.update({ stripeSessionId: session.id });
        return res({ url: session.url }, 200);
    } catch (err) {
        console.error(err);
        return res({ error: 'Could not create order' }, 500);
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
    const action = searchParams.get('action')
    const orderId = searchParams.get('orderId')
    const status = searchParams.get('status')
    try {
        if (action === 'cancelOrder') {
            const body = await req.json()
            const findOrd = await Order.findOne({ where: { id: orderId } })
            await findOrd.update({ isOrdCancel: 1 })
            const adminOptions = {
                from: `Cancel Order <${process.env.SMTP_AUTH_USER}>`,
                to: process.env.ADMIN_MAIL,
                subject: `Order Cancellation Request - OrderId #${body.id}`,
                html: cancelOrd(body)
            }
            const clientOptions = {
                from: `Admin@PurEssence <${process.env.SMTP_AUTH_USER}>`,
                to: process.env.NODE_ENV === 'development' ? body.shippingDetails.email : JSON.parse(body.shippingDetails).email,
                subject: `Working on Order Cancellation - OrderId #${body.id}`,
                html: ordcancelConfirm(body)
            }
            await transporter.sendMail(adminOptions)
            await transporter.sendMail(clientOptions)
            return res({ res: 'Order cancellation in progress!' }, 201)
        }
        const findOrd = await Order.findOne({ where: { id: orderId } })
        await findOrd.update({ orderStatus: status })
        return res({ res: 'Status Updated' }, 201)
    }
    catch (err) {
        console.log(err)
        return res({ res: 'Internal Server Error!', err: err }, 500)
    }
}
