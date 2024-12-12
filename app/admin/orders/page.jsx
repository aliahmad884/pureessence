"use client"
import { useEffect, useState } from "react"
import { useAdminContext } from "../adminContext"
import { usePathname, useRouter } from "next/navigation"
import { BlindsFallBack } from "@/components/loader"
import Link from "next/link"

export default function Orders() {
    const [orderData, setOrderData] = useState([
        { id: "#12452", customer: "Haji Allah Ditta", type: 'Guest', status: "Processing", amount: 1235 },
        { id: "#17842", customer: "Sheikh Sab", type: 'Registered', status: "Completed", amount: 1200 },
    ])


    const { isAuthUser } = useAdminContext()
    const router = useRouter()
    const pathname = usePathname()
    const [isEditable, setIsEditable] = useState(null)
    const [updateStatus, setUpdateStatus] = useState('')
    const [isAuthe, setIsAuth] = useState(true)
    const handleSave = (id) => {
        setOrderData(prev =>
            prev.map(order => order.id === id ? { ...order, status: updateStatus } : order)
        )
        setIsEditable(null);
        setUpdateStatus('');
    };
    const handleDiscard = () => {
        setIsEditable(null);
        setUpdateStatus('');
    };
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
                                <th style={{ width: '20px', whiteSpace: 'nowrap' }}> <input type="checkbox" name="" id="" />&nbsp; Ind.</th>
                                <th style={{ textAlign: 'center' }}>Ord. ID</th>
                                <th>Cust. Name</th>
                                <th style={{ textAlign: 'center' }}>Cust. Type</th>
                                <th style={{ textAlign: 'center' }}>Ord. Date</th>
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
                                        <td><input type="checkbox" name="" id="" /> &nbsp;&nbsp; {index+1}</td>
                                        <td style={{ textAlign: 'center' }}>{data.id}</td>
                                        <td>{data.customer}</td>
                                        <td style={{ textAlign: 'center' }}>{data.type}</td>
                                        <td style={{ textAlign: 'center' }}>12 Jul 2024</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {isEditable === data.id ?
                                                <select onChange={(e) => setUpdateStatus(e.target.value)} defaultValue={data.status}>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Canceled">Canceled</option>
                                                </select>
                                                : data.status}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{data.amount}</td>
                                        <td style={{ textAlign: 'center' }}><i style={{ color: 'blue', cursor: 'pointer' }} title="Invoice Link" className="fi fi-sr-document"></i></td>
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
                                                        <i style={{ cursor: 'pointer' }} title="View Details" className="fi fi-sr-overview"></i>
                                                        &nbsp;
                                                        &nbsp;
                                                        <i style={{ cursor: 'pointer' }} onClick={() => setIsEditable(data.id)} title="Edit Order" className="fi fi-sr-pencil"></i>
                                                        &nbsp;
                                                        &nbsp;
                                                        <i style={{ cursor: 'pointer', color: 'red' }} className="fi fi-rr-trash-empty" title="Delete Order"></i>
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