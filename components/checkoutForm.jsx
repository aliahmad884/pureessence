"use client"

import { useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js"
import { useEffect, useState } from "react"
import countreis from "@/countryWithCode"
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDataContext } from "@/context";
import { Slide, toast, ToastContainer } from "react-toastify";
import toastOptions from "@/options";

export default function CheckoutForm({ dpmCheckerLink }) {
    const { setCartData } = useDataContext()
    const router = useRouter()
    const searhParam = useSearchParams()
    const stripe = useStripe()
    const elements = useElements()
    const [subTotal, setSubtotal] = useState('')
    const [payForm, setPayForm] = useState('')
    const [billForm, setBillForm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
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
                redirect: "if_required",
                confirmParams: {
                    // Make sure to change this to your payment completion page
                    return_url: "http://localhost:3000/completed",
                },
            });
            if (error) {
                toast.error(error.message || 'Something went wrong, Try again!', toastOptions.error)
                setIsLoading(false)
            }
            if (paymentIntent) {
                console.log('Id: ', paymentIntent.id)
                // console.log('Recipte: ', paymentIntent.receipt_email)
                setIsLoading(false)
                toast.success('Transaction Successful, Redirecting to Home...', toastOptions.success)
                localStorage.removeItem('cart')
                setCartData([])
                setTimeout(() => {
                    router.push('/')
                }, 1500)
            }

        } catch (err) {
            toast.error("Something went wrong, Try again!", toastOptions.error)
            console.log(err)
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    };
    const paymentElementOptions = {
        layout: "tabs",
    };
    const handleHide = () => {
        if (billForm && payForm) {
            billForm.classList.add('hide');
            payForm.classList.remove('hide');
        }
    }

    const handleUnHide = () => {
        if (billForm && payForm) {
            payForm.classList.add('hide');
            billForm.classList.remove('hide');
        }
    }

    const handleBillSub = (e) => {
        let form = document.getElementById('billingForm');
        if (!form.checkValidity()) {
            e.preventDefault();
            form.reportValidity()
            return;
        }
        e.preventDefault();
        handleHide()
    }

    useEffect(() => {
        let paymentForm = document.querySelector('.paymentForm')
        let checkoutForm = document.querySelector('.checkoutForm')
        if (paymentForm && checkoutForm) {
            setPayForm(paymentForm);
            setBillForm(checkoutForm)
        }
        setSubtotal(searhParam.get('subtotal'))
    }, [searhParam])
    return (
        <>
            <div className="checkoutPage">
                <ToastContainer />
                <div className="checkoutForm">
                    <form id="billingForm">
                        <div className="header">Shipping Details</div>
                        <label htmlFor="country">Country</label>
                        <select name="country" id="country" required autoComplete="country" defaultValue={'United Kingdom'}>
                            {
                                countreis.map((country, index) => <option key={country.name} value={country.name}>{country.name}</option>)
                            }
                        </select>
                        <div className="nameCont">
                            <div style={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" onChange={(e) => setFirstName(e.target.value)} name="firstName" id="firstName" placeholder="John" required autoComplete="given-name" />
                            </div>
                            <div style={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" onChange={(e) => setLastName(e.target.value)} name="lastName" id="lastName" placeholder="Doe" required autoComplete="family-name" />
                            </div>
                        </div>
                        <label htmlFor="address">Address</label>
                        <input type="text" onChange={(e) => setAddress(e.target.value)} name="address" id="address" placeholder="Address,New York, USA" required autoComplete="address-line1" />
                        <label htmlFor="city">City</label>
                        <input type="text" name="city" id="city" required placeholder="New York" autoComplete="address-level2" />
                        <label htmlFor="phone">Phone</label>
                        <input type="tel" name="phone" id="phone" required placeholder="Phone Number" autoCapitalize="tel" />
                        <label htmlFor="email">Email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} name="email" id="email" required autoComplete="email" placeholder="expample@gmail.com" />
                        <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', justifyContent: 'space-between' }}>
                            <button onClick={() => router.push('/cart')} className="btnBack" type="button">Back to Cart</button>
                            <button onClick={handleBillSub} className="btnNext" type="submit">Next</button>
                        </div>
                    </form>
                </div>
                <div className="paymentForm hide">
                    <div className="reviewDetail">
                        <div className="header">Review And Pay</div>
                        <label>Full Name</label>
                        <input type="text" value={firstName + " " + lastName} readOnly />
                        <label>Email</label>
                        <input type="text" value={email} readOnly />
                        <label>Ship To</label>
                        <input type="text" value={address} readOnly />
                    </div>
                    <form id="payment-form" onSubmit={handlePaySub}>
                        {/* <div className="header">Payment Details</div> */}
                        <PaymentElement id="payment-element" options={paymentElementOptions} />
                        <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', marginTop: '5px', justifyContent: 'space-between' }}>
                            <button onClick={handleUnHide} className="btnBack" type="button">Back</button>
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
                                            }><img src={data.imgUrl} alt={data.title} width={80} /> <strong style={
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