"use client"
import { useEffect, useState } from "react"
import { useAdminContext } from "../adminContext"
import { usePathname, useRouter } from "next/navigation"
import { BlindsFallBack } from "@/components/loader"
import Link from "next/link"

export default function Orders() {
    const [orderData, setOrderData] = useState([])
    const { isAuthUser } = useAdminContext()
    const router = useRouter()
    const pathname = usePathname()
    const [isEditable, setIsEditable] = useState(null)
    const [updateStatus, setUpdateStatus] = useState('')
    const [isAuthe, setIsAuth] = useState(true)
    const handleSave = async (id) => {
        setOrderData(prev =>
            prev.map(order => order.id === id ? { ...order, orderStatus: updateStatus || order.orderStatus } : order)
        )
        setIsEditable(null);
        try {
            const res = await fetch(`/api/order?orderId=${id}&status=${updateStatus}`, { method: 'put' })
            if (res.ok) {
                setUpdateStatus('');
            }
            else alert('Having Error in updating status!')
        }
        catch (err) {
            console.log(err)
        }

    };
    const handleDiscard = () => {
        setIsEditable(null);
        setUpdateStatus('');
    };

    const handleDelete = async (id) => {
        const remainingOrd = orderData.filter(o => o.id !== id)
        try {
            const res = await fetch(`/api/order?orderId=${id}`, {
                method: 'delete'
            })
            if (res.ok) {
                setOrderData(remainingOrd)
                const result = await res.json();
                console.log(result)
            }
            else alert('order not deleted!')
        }
        catch (err) {
            console.log(err)
        }
    }

    const fetchData = async () => {
        try {
            const res = await fetch('/api/order');
            const result = await res.json()
            setOrderData(result)
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    useEffect(() => {
        if (!isAuthUser) router.push(`/admin/authenticate?path=${pathname}`);
        else setIsAuth(false);
    }, [isAuthUser])
    if (isAuthe) return <BlindsFallBack />
    return (
        <div className="adminRoute">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / Orders</p>
                </div>
                <h1>All Orders</h1>
                <p>As an admin, you are allowed to update only the <b> Order Status</b> field in the order table by clicking on the <b>Edit button. No other fields can be changed</b> through this option. If you need to view the <b>full details</b> of an order, you can click on the <b>View button,</b> which will open a detailed page displaying all the order information. For <b>any purpose other than updating the order status,</b> please use the <b>View button </b> to access the full order details.</p>
                {/* <button onClick={() => router.push('/admin/manage-blogs/blog')} className="btn addNew" type="button">Publish New Blog</button> */}
                <div className="tableCont">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '20px', whiteSpace: 'nowrap' }}>
                                    {/* <input type="checkbox" name="" id="" />&nbsp; */}
                                    Ind.
                                </th>
                                <th style={{ textAlign: 'center' }}>Ord. ID</th>
                                <th>Cust. Name</th>
                                <th style={{ textAlign: 'center' }}>Ord. Date</th>
                                <th style={{ textAlign: 'center' }}>Ord. Time</th>
                                <th style={{ textAlign: 'center' }}>Ord. Status</th>
                                <th style={{ textAlign: 'center' }}>T. Amount</th>
                                <th style={{ textAlign: 'center' }}>Inv.</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderData.map((data, index) => (
                                    <tr key={data.id}>
                                        <td>
                                            {/* <input type="checkbox" name="" id="" /> &nbsp;&nbsp; */}
                                            {index + 1}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>#{data.id}</td>
                                        <td>{data.shippingDetails.firstName} {data.shippingDetails.lastName}</td>
                                        <td style={{ textAlign: 'center' }}>{new Date(data.orderDate).toDateString()}</td>
                                        <td style={{ textAlign: 'center' }}>{new Date(data.orderDate).toLocaleTimeString()}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {isEditable === data.id ?
                                                <select onChange={(e) => setUpdateStatus(e.target.value)} defaultValue={data.orderStatus}>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Canceled">Canceled</option>
                                                </select>
                                                : <span className={(data.orderStatus === "Processing") ? 'badge-caution' : (data.orderStatus === 'Completed') ? 'badge-complete' : 'badge-cancel'}>{data.orderStatus}</span>}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{data.totalAmount}</td>
                                        <td style={{ textAlign: 'center' }}><Link href={data.invLink} target="_blank"><i style={{ color: 'blue', cursor: 'pointer' }} title="Invoice Link" className="fi fi-sr-document"></i></Link></td>
                                        <td style={{ textAlign: 'center' }}>
                                            {
                                                isEditable === data.id ? (
                                                    <>
                                                        <i style={{ cursor: 'pointer' }} onClick={() => handleDiscard()} title="Discard Changes" className="fi fi-br-cross"></i>
                                                        &nbsp;
                                                        &nbsp;
                                                        <i style={{ cursor: 'pointer' }} onClick={() => handleSave(data.id)} title="Save Changes" className="fi fi-sr-disk"></i>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link href={`/admin/orders/${data.id}`}><i title="View Details" className="fi fi-sr-overview"></i></Link>
                                                        &nbsp;
                                                        &nbsp;
                                                        <i style={{ cursor: 'pointer' }} onClick={() => setIsEditable(data.id)} title="Edit Order" className="fi fi-sr-pencil"></i>
                                                        &nbsp;
                                                        &nbsp;
                                                        <i style={{ cursor: 'pointer', color: 'red' }} className="fi fi-rr-trash-empty" title="Delete Order" onClick={() => handleDelete(data.id)}></i>
                                                    </>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}