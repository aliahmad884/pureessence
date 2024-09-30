"use client"
import FallBackLoader from "@/components/loader"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function OrderManage() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('orderNumber')
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        setIsLoading(true)
        fetch(`/api/order?orderNumber=${orderNumber}`).then(res => res.json()).then(result => {
            console.log(result.data)
            setData(result.data)
        }).catch(err => console.log(err)).finally(() => setIsLoading(false))
    }, [])
    if (isLoading) return <FallBackLoader />
    return (
        <>
            <div className="manageMainCont">
                <h1>Manage Order</h1>
                <div className="subCont">
                    {data ? (
                        <>
                            <div className="header">
                                <h2>OrderID: #{data ? data.id : '412'}</h2>
                                <div className="badge">{data ? data.orderStatus : 'Status'}</div>
                            </div>
                            <div className="orderDetail">
                                <h2>Order Details</h2>
                                {data.product ? data.product.map(p => (
                                    <div key={`${p.id}`} className="product">
                                        <div className="title">
                                            <img src={p.imgUrl} alt={p.title} width={60} />
                                            <p>{p.title}</p>
                                        </div>
                                        <div className="price"><strong>Price: </strong><p>{p.price}$</p></div>
                                        <div className="qty"><strong>Qty: </strong><p>{p.qty}</p></div>
                                        <div className="total"><strong>Total: </strong><p>{p.price * p.qty}$</p></div>
                                    </div>
                                )) : <p>No data Available</p>}
                            </div>
                            <div className="orderPlaceDesc">
                                <h2>Order Status</h2>
                                <div className="orderStatus">
                                    <div className="date">
                                        <p><strong>OrderID: </strong>#{data.id}</p>
                                        <p><strong>Placed on: </strong> {new Date(data.orderDate).toLocaleString()}</p>
                                        <p><strong>Paid on: </strong> {new Date(data.orderDate).toLocaleString()}</p>
                                        <p><strong>Delivered on: </strong> {data.orderStatus.compDate ? data.orderStatus.compDate : data.orderStatus}</p>
                                        <p><strong>Completed on: </strong> {data.orderStatus.compDate ? data.orderStatus.compDate : data.orderStatus}</p>
                                        <p><strong>Paid by: </strong> {data.paymentMethod}</p>
                                    </div>
                                    <div className="actionCont">
                                        {/* <div className="infoMsg"> */}
                                        <button disabled style={{ backgroundColor: '#dfb434' }} type="button">Cancel</button>
                                        <FontAwesomeIcon className="infoIcon" icon={faCircleInfo} />
                                        <div className="infomsg">lorem ipsum</div>
                                        {/* </div> */}
                                        <button type="button">Write An Review</button>
                                    </div>
                                </div>
                            </div>
                            <div className="orderSummary">
                                <h2>Summary</h2>
                                <div className="ordersummaryCont">
                                    <div className="shipCont">
                                        <p><strong>Name: </strong>{data.shippingDetails.firstName} {data.shippingDetails.lastName}</p>
                                        <p><strong>Ship to: </strong>{data.shippingDetails.address}</p>
                                        <p><strong>Phone: </strong>{data.shippingDetails.phone}</p>
                                    </div>
                                    <div className="orderTotal">
                                        <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>SubTotal: </strong><p>{data.totalAmount}</p></div>
                                        <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Shipping Fee: </strong><p>120</p></div>
                                        <div style={{ borderTop: "2px solid rgb(224, 224, 224)", display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Total: </strong><p>{data.totalAmount + (120 * 100)}</p></div>
                                        <div style={{color:'#607274',fontSize:'small'}}><p>Paid by {data.paymentMethod}</p></div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : <p>No Data Available</p>}
                </div>
            </div>
        </>
    )
}