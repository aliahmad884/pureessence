"use client"
import { useDataContext } from "@/context";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'

export default function Checkout() {
    const [cartData, setCartData] = useState([])
    const [billingInfo, setBillingInfo] = useState('')
    const router = useRouter()
    const handleCancel = () => {
        let ask = confirm('Are you sure, you want to cancel checkout session?')
        if (!ask) return;
        localStorage.removeItem('billingInfo')
        router.push('/cart')
    }
    useEffect(() => {
        let cart = localStorage.getItem('cart')
        let billInfo = localStorage.getItem('billingInfo')
        setCartData(JSON.parse(cart))
        setBillingInfo(JSON.parse(billInfo))
    }, [])
    return (
        <>
            <div className="manageMainCont">
                <h1>Preview Order</h1>
                <div className="subCont">
                    <div className="header">
                        <h2>OrderID: #412</h2>
                        {/* <div className="badge">Status</div> */}
                    </div>
                    <div className="orderDetail">
                        <h2>Order Details</h2>

                        {
                            cartData ? cartData.map(data => (
                                < div key={data.id} className="product" >
                                    <div className="title">
                                        <img src={data.imgUrl} alt={data.title} width={60} />
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
                                <p><strong>Ship to: </strong>{billingInfo.address}</p>
                                <p><strong>Phone: </strong>{billingInfo.phone}</p>
                                <p><strong>Email: </strong>{billingInfo.email}</p>
                            </div>
                            <div className="orderTotal">
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>SubTotal: </strong><p>&pound;{billingInfo.total}</p></div>
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Shipping Fee: </strong><p>&pound;12.63</p></div>
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Dsicount: </strong><p>&pound;0</p></div>
                                <div style={{ borderTop: "2px solid rgb(224, 224, 224)", display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Total: </strong><p><strong>&pound;{eval(billingInfo.total + 12.63 + 0)} GBP</strong></p></div>
                                {/* <div style={{ color: '#607274', fontSize: 'small' }}><p>Paid by amazon_pay</p></div> */}
                            </div>
                        </div>
                    </div>
                    <div className="btnAction">
                        <button onClick={handleCancel} className="cancelBtn" type="button">Cancel</button>
                        <div className="confirmCont">
                            <button className="btnInvoice" type="button">Generate Invoice</button>
                            <button className="btnConfirm" type="button">Confirm Order</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}