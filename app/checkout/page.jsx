"use client"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useEffect, useState } from "react"
import { useDataContext } from "@/context"
import CheckoutForm from "@/components/checkoutForm"
import FallBackLoader from "@/components/loader"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);


export default function Checkout() {
    const [clientSecret, setClientSecret] = useState(null)
    const [dpmLink, setDpmLink] = useState('')
    const { cartData, DOMLoaded, SetDOMLoaded } = useDataContext()

    const [confirmed, setConfirmed] = useState(false);
    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
        if (clientSecret) {
            console.log(clientSecret)
            setConfirmed(clientSecret);
        }
    }, []);
    useEffect(() => {
        const storedCart = localStorage.getItem('cart')
        SetDOMLoaded(true)
        if (storedCart) {
            const options = {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(JSON.parse(storedCart))
            }
            fetch('/api/payment_intent', options).then(res => res.json()).then(data => {
                console.log(data.dpmCheckerLink)
                setClientSecret(data.clientSecret)
                setDpmLink(data.dpmCheckerLink)
                SetDOMLoaded(false)
            })
        }
    }, [])
    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret: clientSecret,
        appearance,
    };
    if (DOMLoaded) return <FallBackLoader />
    return (
        <>
            <main>
                {
                    clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm dpmCheckerLink={dpmLink} />
                        </Elements>
                    )
                }
            </main>
        </>
    )
}