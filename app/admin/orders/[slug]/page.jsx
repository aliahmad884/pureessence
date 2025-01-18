"use client"

import { useEffect, useState } from "react";
import { useAdminContext } from "../../adminContext";
import { BlindsFallBack } from "@/components/loader";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Orders({ params }) {
    const router = useRouter()
    const { isAuthUser } = useAdminContext()
    const { slug } = params;
    const [isAuthe, setIsAuth] = useState(true)
    const [order, setOrder] = useState(null)
    const [shipDetails, setShipDetails] = useState({})
    const [products, setProducts] = useState([])
    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/order?orderNumber=${slug}`)
            if (res.ok) {
                const result = await res.json();
                setOrder(result.data)
                setShipDetails(process.env.NODE_ENV === 'development' ? result.data.shippingDetails : JSON.parse(result.data.shippingDetails))
                setProducts(process.env.NODE_ENV === 'development' ? result.data.product : JSON.parse(result.data.product))
            }
            else {
                alert('There is a problem in fetching the order!')
                router.push('/admin/orders')
            }
        }
        catch (err) {
            console.log(err)
            router.push('/admin/orders')
        }
    }
    useEffect(() => {
        fetchOrder()
    }, [])
    useEffect(() => {
        if (!isAuthUser) router.push(`/admin/authenticate?path=${pathname}`);
        else setIsAuth(false);
    }, [isAuthUser])
    if (isAuthe) return <BlindsFallBack />
    return (
        <div className="adminRoute">
            {order &&
                <div className="subCont">
                    <div className="breadCrumbs">
                        <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / <Link style={{ textDecoration: 'underline' }} href="/admin/orders">Orders</Link> / {slug}</p>
                    </div>
                    <h1>Order #{slug}</h1>

                    <div className="orderStatusBar">
                        <p style={{ border: 'none' }}>{new Date(order.orderDate).toDateString()} at {new Date(order.orderDate).toLocaleTimeString()} </p>
                        <p>{products?.length} Items</p>
                        <p>Total: £{order.totalAmount}</p>
                        <p><span className={(order.orderStatus === "Processing") ? 'badge-caution' : (order.orderStatus === 'Completed') ? 'badge-complete' : 'badge-cancel'}>{order.orderStatus}</span></p>
                    </div>
                    <div className="o-summary-cont">
                        <div className="o-d-cont">
                            <div className="tableCont">
                                {/* <h2>Items</h2> */}
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Qty</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products &&
                                            products.map((data, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <div className="row align-center">
                                                            <img loading="lazy" src={`/api/uploadImg?path=${encodeURIComponent(data.pImages ? data.pImages[0] : data.imgUrl)}`} alt={data.pName ? data.pName : data.title} width={60} /> &nbsp;
                                                            <p>{data.pName ? data.pName : data.title}</p>
                                                        </div>
                                                    </td>
                                                    <td>£{data.price}</td>
                                                    <td>{data.qty}</td>
                                                    <td>£{data.price * data.qty}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="card box-shadow-1 p-4">
                                <h2>Summary</h2>
                                <div className="row justify-between">
                                    <p>SubTotal: </p>
                                    <p>£{order.totalAmount}</p>
                                </div>
                                <div className="row justify-between">
                                    <p>Discount: </p>
                                    <p>£{order.discount}</p>
                                </div>
                                <div className="row justify-between">
                                    <p>Shipping: </p>
                                    <p>£{order.shipFee}</p>
                                </div>
                                <div className="row justify-between" style={{ borderTop: '1px solid #dfe2e5', marginTop: '5px', paddingTop: '5px' }}>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Total: </p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>£{(parseFloat(order.totalAmount) - parseFloat(order.discount) + parseFloat(order.shipFee)).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="cus-d-cont">
                            <div className="card box-shadow-1 p-4">
                                <h2>Customer</h2>
                                <div className="profile row align-center">
                                    <img src="/iconImgs/user.png" alt="temp img" width={40} />
                                    <p>{shipDetails && shipDetails.firstName} {shipDetails && shipDetails.lastName}</p>
                                </div>
                            </div>
                            <div className="card box-shadow-1 p-4">
                                <h2>Contact</h2>
                                <p>Name: {shipDetails && shipDetails.firstName} {shipDetails && shipDetails.lastName}</p>
                                <p>Email: {shipDetails && shipDetails.email}</p>
                                <p>Phone: {shipDetails && shipDetails.phone}</p>
                            </div>
                            <div className="card box-shadow-1 p-4">
                                <h2>Shipping Adress</h2>
                                <p>Country: {shipDetails && shipDetails.city}</p>
                                <p>City: {shipDetails && shipDetails.country}</p>
                                <p>Address: {shipDetails && shipDetails.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}