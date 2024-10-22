"use client"
import FallBackLoader from "@/components/loader";
import { useDataContext } from "@/context";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react'

export default function Checkout() {
    const { setCartData } = useDataContext()
    const searchParams = useSearchParams()
    const uniqueId = searchParams.get('uniqueId')
    const [cartData, setCart] = useState([])
    const [billingInfo, setBillingInfo] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [subTotal, setSubTotal] = useState('')
    const [invUrl, setInvUrl] = useState({
        invId: '',
        invUrl: ''
    })
    const [isOrderConfirmed, setOrderConfirmed] = useState(false)
    const router = useRouter()
    const handleCancel = () => {
        let ask = confirm('Are you sure, you want to cancel checkout session?')
        if (!ask) return;
        localStorage.removeItem('billingInfo')
        router.push('/cart')
    }
    const handleConfirm = () => {
        setIsLoading(true)
        let body = { ...billingInfo, cartData }
        fetch('/api/order?reqTyp=invoice', {
            method: 'post',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(body)
        }).then(res => res.json()).then(result => {
            console.log(result)
            setIsLoading(false)
            setOrderConfirmed(true)
            localStorage.removeItem('uniqueId')
            localStorage.removeItem('billingInfo')
            localStorage.removeItem('cart')
            setCartData([])
            setInvUrl({
                invId: result.invId,
                invUrl: result.invUrl
            })
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        })
    }
    useEffect(() => {
        let cart = localStorage.getItem('cart')
        let arr = []
        let cartData = JSON.parse(cart)
        cartData.forEach(ele => {
            arr.push(Number(ele.price) * ele.qty)
        })
        let total = arr.reduce((prev, curr) => prev + curr, 0)
        setSubTotal(total)
        let billInfo = localStorage.getItem('billingInfo')
        let uniqId = localStorage.getItem('uniqueId')
        if (!billInfo) {
            return router.push('/products')
        }
        if (uniqId !== uniqueId) {
            setOrderConfirmed(true)
        }
        setCart(JSON.parse(cart))
        setBillingInfo(JSON.parse(billInfo))
        setIsLoading(false)
    }, [])
    if (isLoading) {
        return <FallBackLoader />
    }
    return (
        <>
            <div className="manageMainCont">
                <h1>Preview Order</h1>
                <div className="subCont">
                    <div className="header">
                        <h2>OrderID: #412</h2>
                    </div>
                    <div className="orderDetail">
                        <h2>Order Details</h2>

                        {
                            cartData ? cartData.map(data => (
                                < div key={data.id} className="product" >
                                    <div className="title">
                                        <img loading="lazy" src={data.imgUrl} alt={data.title} width={60} />
                                        <p>{data.title}</p>
                                    </div>
                                    <div className="price"><strong>Price: </strong><p>&pound;{data.price}</p></div>
                                    <div className="qty"><strong>Qty: </strong><p></p>{data.qty}</div>
                                    <div className="total"><strong>Total: </strong><p>&pound;{data.qty * data.price}</p></div>
                                </div>
                            )) : null
                        }
                    </div>
                    <div className="orderSummary">
                        <h2>Summary</h2>
                        <div className="ordersummaryCont">
                            <div className="shipCont">
                                <p><strong>Name: </strong>{billingInfo.firstName} {billingInfo.lastName}</p>
                                <p><strong>Email: </strong>{billingInfo.email}</p>
                                <p><strong>Phone: </strong>{billingInfo.phone}</p>
                                <p><strong>Ship to: </strong>{billingInfo.address}</p>
                            </div>
                            <div className="orderTotal">
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>SubTotal: </strong><p>&pound;{subTotal}</p></div>
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Shipping Fee: </strong><p>&pound;12.63</p></div>
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Discount: </strong><p>&pound;0</p></div>
                                <div style={{ borderTop: "2px solid rgb(224, 224, 224)", display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Total: </strong><p><strong>&pound;{eval(subTotal + 12.63 + 0)} GBP</strong></p></div>
                            </div>
                        </div>
                    </div>
                    <div className="btnAction">
                        {
                            isOrderConfirmed ? (<button onClick={() => router.push('/products')} className="cancelBtn" type="button">Back to shopping</button>) : <button onClick={handleCancel} className="cancelBtn" type="button">Cancel</button>
                        }
                        <div className="confirmCont">
                            <button style={isOrderConfirmed ? { display: 'block' } : { display: 'none' }} onClick={() => router.push(`/invoice?invId=${invUrl.invId}&ul=${invUrl.invUrl}`)} className="btnInvoice" type="button">View Invoice</button>
                            <button disabled={isOrderConfirmed ? true : false} onClick={handleConfirm} className="btnConfirm" type="button">{isOrderConfirmed ? (<><FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} /> Confirmed</>) : 'Confirm Order'}</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}