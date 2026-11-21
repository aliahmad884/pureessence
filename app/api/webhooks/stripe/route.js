import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import sequelize from '@/app/api/dbConnection';
import { Order, WebhookEvent } from '@/app/api/schemas';
import { sendOrderEmails } from '../../lib/email/orderEmail';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    // 1. Verify the signature using the RAW body (do not call req.json())
    console.log("---------------------------------------")
    console.log("--------------Web Hook Called------------")
    const signature = req.headers.get('stripe-signature');
    const rawBody = await req.text();

    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Already handled this event? Acknowledge and stop.
    if (await WebhookEvent.findByPk(event.id)) {
        return NextResponse.json({ received: true, duplicate: true });
    }

    try {
        let paidOrderId = null;

        // 3. All DB changes happen in ONE transaction, together with recording the event.
        //    If anything throws, everything rolls back and Stripe retries later.
        await sequelize.transaction(async (t) => {
            await WebhookEvent.create({ id: event.id, type: event.type }, { transaction: t });

            switch (event.type) {
                case 'checkout.session.completed':
                case 'checkout.session.async_payment_succeeded': {
                    const session = event.data.object;
                    // For delayed payment methods, "completed" arrives with payment_status "unpaid"
                    if (session.payment_status === 'paid') {
                        paidOrderId = await markOrderPaid(session, t);
                    }
                    break;
                }
                case 'checkout.session.async_payment_failed':
                case 'checkout.session.expired':
                    await cancelPendingOrder(event.data.object, t);
                    break;
                default:
                    break; // ignore events we don't use
            }
        });

        // 4. Side effects AFTER the commit. A failure here must not undo the payment.
        if (paidOrderId) await runPostPaymentTasks(paidOrderId);

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error('Webhook processing failed:', err);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 }); // Stripe will retry
    }
}

async function markOrderPaid(session, t) {
    const orderId = session.client_reference_id || session.metadata?.order_id;
    if (!orderId) {
        console.error('Paid session without order id:', session.id);
        return null;
    }

    // Lock the row so two concurrent events can't process the same order
    const order = await Order.findOne({
        where: { order_id: orderId },
        transaction: t,
        lock: t.LOCK.UPDATE,
    });
    if (!order) {
        console.error('Order not found for paid session:', orderId);
        return null;
    }

    if (order.orderStatus !== 'Pending') {
        // Already paid, or it was cancelled/expired before the payment arrived.
        if (order.orderStatus === 'Cancelled') {
            await order.update(
                { reviewNote: `Payment received for a cancelled order (session ${session.id}). Refund or restore it.` },
                { transaction: t }
            );
        }
        return null;
    }

    const notes = [];

    // Check that what Stripe charged matches what we stored
    const expectedPence = Math.round(Number(order.totalAmount) * 100);
    if (session.amount_total !== expectedPence || session.currency !== 'gbp') {
        notes.push(`Amount mismatch: Stripe ${session.amount_total} ${session.currency}, expected ${expectedPence} gbp`);
    }

    await order.update(
        {
            orderStatus: notes.length ? 'Needs Review' : 'Processing',
            paymentMethod: 'stripe',
            stripePaymentIntentId: session.payment_intent,
            payment: "Paid",
            paidAt: new Date(),
            reviewNote: notes.length ? notes.join(' | ') : null,
        },
        { transaction: t }
    );

    return order.order_id;
}

async function cancelPendingOrder(session, t) {
    const orderId = session.client_reference_id || session.metadata?.order_id;
    if (!orderId) return;

    const order = await Order.findOne({
        where: { order_id: orderId },
        transaction: t,
        lock: t.LOCK.UPDATE,
    });
    if (order && order.orderStatus === 'Pending') {
        await order.update({ orderStatus: 'Cancelled' }, { transaction: t });
    }
}


async function runPostPaymentTasks(orderId) {
    try {
        const order = await Order.findOne({ where: { order_id: orderId } });
        if (order) await sendOrderEmails(order);
    } catch (err) {
        console.error(`Post-payment tasks failed for ${orderId}:`, err);
    }
}