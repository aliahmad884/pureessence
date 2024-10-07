"use client"
import Link from "next/link"
import "./invoiceStyle.css"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import FallBackLoader from "@/components/loader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPrint } from "@fortawesome/free-solid-svg-icons"

export default function Invoice() {
    const [invData, setInvData] = useState(null)
    const [isLoading, setIsloading] = useState(true)
    const params = useSearchParams()
    const invId = params.get('invId')
    const printInvoice = () => {
        window.print()
    }
    useEffect(() => {
        fetch(`/api/order?invId=${invId}`).then(res => res.json()).then(result => {
            console.log(result)
            setInvData(result.data)
            setIsloading(false)
        }).catch(err => {
            console.log(err)
            setIsloading(false)
        })
    }, [])
    if (isLoading) return <FallBackLoader />;
    else if (invData) {
        return (
            <div className="invoice">
                <div className="invoice-header">
                    <div>
                        <h1>Invoice</h1>
                        <h3 style={{ textAlign: 'right' }}>PE-INV-000{invData.id}</h3>
                        <p><strong>Date:</strong> {new Date(invData.date).toDateString()} {new Date(invData.date).toLocaleTimeString()}</p>
                    </div>
                    {/* Your company information */}
                    <div className="brandInfo">
                        <Link href={'/'}><img src="/logos/PE-Main-Logo.png" alt="Pur Essence" width={300} /></Link>
                        <p><strong>Address: </strong>Kings court 33 king street BB2 2DH</p>
                        <p><strong>Email:</strong> info@puressenceltd.co.uk</p>
                        <p><strong>Phone:</strong> +1234567890</p>
                    </div>
                </div>
                <div className="billing-details">
                    <div className="client">
                        <h3>Client Details</h3>
                        <p><strong>Name: </strong>{invData.billing.firstName} {invData.billing.lastName}</p>
                        <p><strong>Email: </strong>{invData.billing.email}</p>
                        <p><strong>Phone: </strong>{invData.billing.phone}</p>
                        <p><strong>Address: </strong>{invData.billing.address}</p>
                    </div>
                    <div className="bank">
                        <h3>Bank Account Details</h3>
                        <p><strong>Bank Name: </strong>Meezan Bank LTD.</p>
                        <p><strong>Account Number: </strong>42479416798875456456</p>
                    </div>
                </div>

                <div className="invoice-body">
                    <table>
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invData.items ? invData.items.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img src={item.imgUrl} alt={item.title} width={60} />&nbsp;
                                            <p>{item.title}</p>
                                        </div>
                                    </td>
                                    <td>{item.qty}</td>
                                    <td>&pound;{item.price}</td>
                                    <td>&pound;{item.price * item.qty}</td>
                                </tr>
                            )) : console.log('invData.itmes Not found')
                            }
                        </tbody>
                    </table>
                </div>
                <div className="amount-container">
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        <div className="subCont"><strong>Subtotal:</strong><p>&pound;{invData.billing.total}</p></div>
                        <div className="subCont"><strong>Shipping:</strong><p>&pound;12.63</p></div>
                        <div className="subCont"><strong>Tax(if Applicable):</strong><p>&pound;0.00</p></div>
                        <div className="subCont"><strong>Discount:</strong><p>&pound;0.00</p></div>
                        <div style={{ borderTop: '2px solid rgb(224, 224, 224)', marginTop: '10px', paddingTop: '8px', fontSize: '1.2rem' }} className="subCont"><strong>Total:</strong><p>&pound;{eval(invData.billing.total + 12.63 + 0)}</p></div>
                    </div>
                </div>
                <div className="invoice-footer">
                    <div>
                        <h4><strong>Notes:</strong></h4>
                        <p>Thanks for being an awesome customer!</p>
                        <h4><strong>Terms:</strong></h4>
                        <p>Payment due in 30 days.</p>
                    </div>
                    <div>
                        <button onClick={printInvoice} className="btnPrint" type="button"><FontAwesomeIcon icon={faPrint} /> Print Invoice</button>
                    </div>
                </div>
            </div>
        )
    }
}