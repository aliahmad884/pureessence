"use client"
import FallBackLoader from "@/components/loader"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function OrderManage() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('orderNumber')
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCancelable, setIsCancelable] = useState(false)
    const [shipDetails, setShipDetails] = useState(null)
    const [btnText, setBtnText] = useState(null)

    const handleCancel = async () => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Order cancellation',
                text: 'Please provide the reason for your order cancellation. Our support team will review your request and contact you as soon as possible to assist further.',
                input: 'textarea',
                inputPlaceholder: 'Enter the reason of cancellation'
            })
            if (reason) {
                setBtnText('sending....')
                const res = await fetch(`/api/sendMail?action=cancelOrder`, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, reason: reason })
                })
                if (res.ok) {
                    const cancelReq = JSON.parse(localStorage.getItem('cancelReq'))
                    await res.json()
                    localStorage.setItem('cancelReq', JSON.stringify([...cancelReq, { orderId: data.id, sent: true }]))
                    setBtnText('Cancelation in progress')
                    setIsCancelable(true)
                }
                else {
                    const result = await res.json()
                    console.log(result)
                    setBtnText(null)
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const fetchOrder = async () => {
        const cancelReq = JSON.parse(localStorage.getItem('cancelReq'))
        const user = localStorage.getItem('user');
        const userInfo = JSON.parse(user)
        try {
            const res = await fetch(`/api/order?orderNumber=${orderNumber}&user=${userInfo.Email}`)
            if (res.ok) {
                const result = await res.json()
                let orderDate = new Date(result.data.orderDate)
                let mili = Date.now() - orderDate
                const time = mili / (1000 * 60 * 60)
                if (time >= 24) {
                    setIsCancelable(true)
                    setBtnText(null)
                    const find = cancelReq.some(prev => prev.orderId === result.data.id)
                    if (find) {
                        const remaining = cancelReq.filter(data => data.orderId !== result.data.id)
                        localStorage.setItem('cancelReq', JSON.stringify([...remaining]))
                    }
                }
                else if (cancelReq && cancelReq.some(prev => prev.orderId === result.data.id)) {
                    setIsCancelable(true)
                    setBtnText('Cancelation in progress')
                }
                setData(result.data)
                setShipDetails(process.env.NODE_ENV === 'development' ? result.data.shippingDetails : JSON.parse(result.data.shippingDetails))
            }
            return null;
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        document.title = 'Order Manage | PurEssence'
        setIsLoading(true)
        fetchOrder()
    }, [])
    if (isLoading) return <FallBackLoader />
    return (
        <div className="manageMainCont">
            <div className="bCrumbsGlobal">
                <h2><Link href={'/profile'}>Profile</Link> / <Link href={'/profile/my-orders'}>My Orders</Link> / Manage Order</h2>
            </div>
            <div className="subCont">
                {data ? (
                    <>
                        <div className="header">
                            <h2>OrderID: #{data ? data.id : '412'}</h2>
                            <div className="badge">{data ? data.orderStatus : 'Status'}</div>
                        </div>
                        <div className="orderDetail">
                            <h2>Order Details</h2>
                            {data.product ? (process.env.NODE_ENV === 'development' ? data.product : JSON.parse(data.product)).map(p => (
                                <div key={`${p.id}`} className="product">
                                    <div className="title">
                                        <img loading="lazy" src={`/api/uploadImg?path=${encodeURIComponent(p.pImages ? p.pImages[0] : p.imgUrl)}`} alt={p.pName ? p.pName : p.title} width={60} />
                                        <p><Link style={{ textDecoration: 'underline' }} href={`/products/${p.slug}`} target="_blank">{p.pName ? p.pName : p.title}</Link></p>
                                    </div>
                                    <div className="price"><strong>Price: </strong><p>£{p.price}</p></div>
                                    <div className="qty"><strong>Qty: </strong><p>{p.qty}</p></div>
                                    <div className="total"><strong>Total: </strong><p>£{p.price * p.qty}</p></div>
                                </div>
                            )) : <p>No data Available</p>}
                        </div>
                        <div className="orderPlaceDesc">
                            <h2>Order Status</h2>
                            <div className="orderStatus">
                                <div className="date">
                                    <p><strong>OrderID: </strong>#{data.id}</p>
                                    <p><strong>Placed on: </strong> {new Date(data.orderDate).toDateString()}</p>
                                </div>
                                <div className="actionCont">
                                    <button onClick={handleCancel} disabled={isCancelable} style={isCancelable ? { backgroundColor: 'grey' } : null} type="button">{btnText ? btnText : 'Cancel Order'}</button>
                                    <p className="infomsg">lorem ipsum sit amit</p>
                                </div>
                            </div>
                            <div className="disclaimCont">
                                <h2>Note:</h2>
                                <p>You can cancel your order within 24 hours of placing it. After 24 hours, cancellations are not allowed.For more details, please read our <Link href={'/legal/shipping-returns-policy'} style={{ fontWeight: 'bold', color: '#85aeff' }}>Shipping & Returns</Link> Policy or contact our support team.</p>
                            </div>
                        </div>
                        <div className="orderSummary">
                            <h2>Summary</h2>
                            <div className="ordersummaryCont">
                                <div className="shipCont">
                                    <p><strong>Name: </strong>{shipDetails.firstName} {shipDetails.lastName}</p>
                                    <p><strong>Ship to: </strong>{shipDetails.address}</p>
                                    <p><strong>Phone: </strong>{shipDetails.phone}</p>
                                </div>
                                <div className="orderTotal">
                                    <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>SubTotal: </strong><p>£{data.totalAmount}</p></div>
                                    <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Shipping Fee: </strong><p>£{data.shipFee}</p></div>
                                    <div style={{ borderTop: "2px solid rgb(224, 224, 224)", display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Total: </strong><p>£{(parseFloat(data.totalAmount) + parseFloat(data.shipFee)).toFixed(2)}</p></div>
                                    {/* <div style={{ color: '#607274', fontSize: 'small' }}><p>Paid by {data.paymentMethod}</p></div> */}
                                </div>
                            </div>
                        </div>
                    </>
                ) : <p>No Data Available</p>}
            </div>
        </div>
    )
}