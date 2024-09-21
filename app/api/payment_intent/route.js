import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const calculateAmout = (item) => {
    let arr = []
    item.forEach(ele => {
        arr.push(Number(ele.price) * ele.qty)
    });
    let amount = 0;
    for (let i = 0; i < arr.length; i++) {
        amount = amount + arr[i]
    }
    return amount*100;
}

export async function POST(req) {
    const items = await req.json()
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateAmout(items),
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true
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

