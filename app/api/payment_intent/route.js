import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)



export async function POST(req) {
    const body = await req.json()
    const paymentIntent = await stripe.paymentIntents.create({
        amount: body.total,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true
        },
        receipt_email: body.email,
        shipping: {
            name: `${body.firstName} ${body.lastName}`,
            address: {
                line1: body.address,
                city: body.city,
                country: body.country,
            },
            phone: body.phone,
        }
    })

    return new Response(JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    })
}

