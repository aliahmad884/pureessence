"use client"
import FallBackLoader from "@/components/loader";
import { useDataContext } from "@/context";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react'

export default function Checkout() {
    const { setCartData, loggedUser } = useDataContext()
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
    const emptyCart = async () => {
        localStorage.removeItem('cart')
        setCartData([])
        try {
            await fetch(`/api/userCart?action=delAll`, {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loggedUser.Email })
            })
        }
        catch (err) {
            console.log('Error in removing cart items!')
            console.log(err)
        }
    }
    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            let body = { ...billingInfo, cartData, subTotal, discount: 0, shipFee: 0, userId: loggedUser.Email }
            const res = await fetch('/api/order?reqTyp=invoice', {
                method: 'post',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(body)
            })
            if (res.ok) {
                const result = await res.json();
                setIsLoading(false)
                setOrderConfirmed(true)
                localStorage.removeItem('uniqueId')
                localStorage.removeItem('billingInfo')
                await emptyCart()
                setInvUrl({
                    invId: result.invId,
                    invUrl: result.invUrl
                })
            }
            else {
                alert('Having problem to proceed your order, please try again later.')
            }
        }
        catch (err) {
            alert('Having problem to proceed your order, please try again later.')
            console.log(err)
        }
        finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        document.title = 'Checkout'
        let cart = localStorage.getItem('cart')
        let arr = []
        let cartData = JSON.parse(cart)
        if (cartData) {
            cartData.forEach(ele => {
                arr.push(Number(ele.price) * ele.qty)
            })
        }
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
        <div className="manageMainCont">
            <h1>Preview Order</h1>
            <div className="subCont">
                <div className="header">
                    <h2>OrderID: #412</h2>
                </div>
                <div className="orderDetail">
                    <h2>Order Details</h2>

                    {
                        cartData && cartData.map(data => (
                            < div key={data.id} className="product" >
                                <div className="title">
                                    <img loading="lazy" src={data.pImages ? data.pImages[0] : data.imgUrl} alt={data.pName ? data.pName : data.title} width={60} />
                                    <p><Link style={{textDecoration:'underline'}} href={`/products/${data.slug}`} target="_blank">{data.pName ? data.pName : data.title}</Link></p>
                                </div>
                                <div className="price"><strong>Price: </strong><p>&pound;{data.price}</p></div>
                                <div className="qty"><strong>Qty: </strong><p></p>{data.qty}</div>
                                <div className="total"><strong>Total: </strong><p>&pound;{data.qty * data.price}</p></div>
                            </div>
                        ))
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
                            <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Shipping Fee: </strong><p>&pound;0</p></div>
                            <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Discount: </strong><p>&pound;0</p></div>
                            <div style={
                                {
                                    borderTop: "2px solid rgb(224, 224, 224)",
                                    display: 'flex', flexFlow: 'row nowrap',
                                    justifyContent: 'space-between'
                                }
                            }><strong>Total: </strong><p><strong>&pound;{
                                (subTotal + 0 + 0).toLocaleString('eng-GB',
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )
                            } GBP</strong></p></div>
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
    )
}