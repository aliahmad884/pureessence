"use client"

import { useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js"
import { useEffect, useState } from "react"
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDataContext } from "@/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

export default function CheckoutForm({ dpmCheckerLink }) {
    const { setCartData, loggedUser, setLoggedUser } = useDataContext()
    const router = useRouter()
    const searhParam = useSearchParams()
    const stripe = useStripe()
    const elements = useElements()
    const [subTotal, setSubtotal] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')


    const handlePaySub = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        setIsLoading(true)
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
                confirmParams: {
                    return_url: "http://localhost:3000/completed",
                },
            });
            if (error) {
                // toast.error(error.message || 'Something went wrong, Try again!', toastOptions.error)
                toast.error(error.message || 'Something went wrong, Try again!')
                setIsLoading(false)
            }
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                const billingInfo = localStorage.getItem('billingInfo')
                const cartProducts = localStorage.getItem('cart')
                setIsLoading(false)
                await fetch(`/api/order?paymentIntentId=${paymentIntent.id}`, {
                    method: 'post',
                    headers: { "Content-Type": 'application/json' },
                    body: JSON.stringify({ info: JSON.parse(billingInfo), products: JSON.parse(cartProducts) })
                })
                if (loggedUser) {
                    await fetch('/api/userCart?action=delAll', {
                        method: 'delete',
                        headers: { "Content-Type": 'application/json' },
                        body: JSON.stringify({ email: loggedUser.Email })
                    })
                }
                localStorage.removeItem('cart')
                localStorage.removeItem('billingInfo')
                setCartData([])
                router.push('/')
            }

        } catch (err) {
            // toast.error("Something went wrong, Try again!", toastOptions.error)
            toast.error("Something went wrong, Try again!")
            console.log(err)
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    };
    const paymentElementOptions = {
        layout: "tabs",
    };

    useEffect(() => {
        setSubtotal(searhParam.get('subtotal'))
        let billing = localStorage.getItem('billingInfo')
        let body = JSON.parse(billing)
        setName(`${body.firstName} ${body.lastName}`)
        setEmail(body.email)
        setAddress(body.address)
    }, [searhParam])
    return (
        <>
            <Toaster />
            <div className="checkoutPage">
                <div className="paymentForm">
                    <div className="reviewDetail">
                        <div className="header">Review And Pay</div>
                        <label>Full Name</label>
                        <input type="text" value={name} readOnly />
                        <label>Email</label>
                        <input type="text" value={email} readOnly />
                        <label>Ship To</label>
                        <input type="text" value={address} readOnly />
                    </div>
                    <form id="payment-form" onSubmit={handlePaySub}>
                        <PaymentElement id="payment-element" options={paymentElementOptions} />
                        <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', marginTop: '5px', justifyContent: 'space-between' }}>
                            <button onClick={() => router.push('/shipping')} className="btnBack" type="button">Back</button>
                            <button disabled={isLoading || !stripe || !elements} className="btnNext" type="submit">{isLoading ? 'Proccessing...' : 'Pay Now'}</button>
                        </div>
                    </form>
                </div>
                <div className="orderSummary">
                    <div className="summaryCont">
                        <h1>Order Summary</h1>
                        {/* <table>
                            <tbody>
                                {
                                    cartData.map(data => (<>
                                        <tr key={data.id}>
                                            <td style={
                                                {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    // width: '300px',
                                                    overflow: "hidden",
                                                    margin: '0 20px 0 0',
                                                    position: 'relative'
                                                }
                                            }><img loading="lazy"  src={data.imgUrl} alt={data.title} width={80} /> <strong style={
                                                {
                                                    whiteSpace: 'nowrap',
                                                    overflowY: 'hidden',
                                                    width: '120px',
                                                    fontSize: '0.8rem'
                                                    // minWidth:'200px'
                                                }
                                            }>{data.title}</strong> <div style={
                                                {
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: '50px',
                                                    backgroundColor: 'cadetblue',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '5px',
                                                    height: '30px',
                                                    width: '30px',
                                                    borderRadius: '50%'
                                                }
                                            }>{data.qty}</div></td>
                                            <td style={{ fontWeight: 'bold', textAlign: 'right' }}>${data.price * data.qty}</td>
                                        </tr >
                                    </>))
                                }
                                <tr>
                                    <td>Subtotal</td>
                                    <td style={{ textAlign: 'right' }}>{subTotal ? subTotal : 'Not Found'}</td>
                                </tr>
                                <tr>
                                    <td>Shipping Fee</td>
                                    <td style={{ textAlign: 'right' }}>$400</td>
                                </tr>
                                <tr>
                                    <td><strong style={{ fontSize: '1.3rem' }}>Total</strong></td>
                                    <td style={{ textAlign: 'right', display: 'flex', flexFlow: 'row nowrap', alignItems: 'end', justifyContent: 'center', gap: '3px' }}><small> USD </small><strong style={{ fontSize: '1.3rem' }}>${Number(subTotal) + 400}</strong></td>
                                </tr>
                            </tbody>
                        </table> */}
                    </div>
                </div>
            </div >
        </>
    )
}

export function CustomeToast({ onClick }) {
    return (
        <>
            <div onClick={onClick} style={{
                // height: '20px',
                maxWidth: '300px',
                width: '100%',
                backgroundColor: "white",
                borderRadius: '10px',
                display: 'flex',
                flexFlow: 'row nowrap',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                position: 'fixed',
                top: '5px',
                left: '50%',
                transform: 'translate(-50%)',
                padding: '25px 15px',
                zIndex: '100',
                border: '1px solid black'
            }}>
                <FontAwesomeIcon style={{ color: 'green', fontSize: '1.8rem' }} icon={faCircleCheck} />
                <p>Transaction Successfull!</p>
            </div>
        </>
    )
}