"use client"
import Link from "next/link"
import "./invoiceStyle.css"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import FallBackLoader from "@/components/loader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faCross, faPrint } from "@fortawesome/free-solid-svg-icons"

export default function Invoice() {
    const [invData, setInvData] = useState([])
    const [invItems, setInvItems] = useState([])
    const [billingData, setBillingData] = useState([])
    const [invnotFound, setInvNotFound] = useState(false)
    const [isLoading, setIsloading] = useState(true)
    const params = useSearchParams()
    const invId = params.get('invId')
    const invUrl = params.get('ul')
    const printInvoice = () => {
        window.print()
    }
    useEffect(() => {
        document.title = 'Invoice | PurEssence'

        const fetchInv = async () => {
            try {

                let res = await fetch(`/api/order?invId=${invId}&ul=${invUrl}`)
                if (!res.ok) {
                    setIsloading(false)
                    return setInvNotFound(true)
                }
                let result = await res.json()
                // setInvItems(result.data.items)
                // setBillingData(result.data.billing)
                setInvItems(JSON.parse(result.data.items))
                setBillingData(JSON.parse(result.data.billing))
                setInvData(result.data)
                setIsloading(false)
            }
            catch (err) {
                console.log(err)
                setIsloading(false)
            }
        }
        fetchInv()
    }, [])
    if (isLoading) return <FallBackLoader />;
    else if (invnotFound) {
        return (
            <>
                <div style={{ margin: '150px 20px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '50px' }}><FontAwesomeIcon style={{ color: 'red' }} icon={faCircleXmark} /> Invoice not found, please provide an correct URL</h1>
                    <Link style={{ textDecoration: 'underline' }} href={'/'}>Go to Home Page</Link>
                </div>
            </>
        )
    }
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
                        <Link href={'/'}><img loading="lazy" src="/logos/PE-Main-Logo.png" alt="Pur Essence" width={300} /></Link>
                        <p><strong>Address: </strong>Kings Court 33 King Street, Blackburn, UK, BB2 2DH</p>
                        <p><strong>Email:</strong> info@puressenceltd.co.uk</p>
                        <p><strong>Phone:</strong> (+44) 01254 411076</p>
                    </div>
                </div>
                <div className="billing-details">
                    <div className="client">
                        <h3>Client Details</h3>
                        <p><strong>Name: </strong>{billingData.firstName} {billingData.lastName}</p>
                        <p><strong>Email: </strong>{billingData.email}</p>
                        <p><strong>Phone: </strong>{billingData.phone}</p>
                        <p><strong>Address: </strong>{billingData.address}</p>
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
                            {invItems ? invItems.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img loading="lazy" src={`/api/uploadImg?path=${encodeURIComponent(item.pImages ? item.pImages[0] : item.imgUrl)}`} alt={item.pName} width={60} />&nbsp;
                                            <p><Link style={{textDecoration:'underline'}} href={`/products/${item.slug}`} target="_blank">{item.pName ? item.pName : item.title}</Link></p>
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
                        <div className="subCont"><strong>Subtotal:</strong><p>&pound;{invData.total}</p></div>
                        <div className="subCont"><strong>Shipping:</strong><p>&pound;{invData.shipFee}</p></div>
                        {/* <div className="subCont"><strong>Tax(if Applicable):</strong><p>&pound;0.00</p></div> */}
                        <div className="subCont"><strong>Discount:</strong><p>&pound;{invData.discount}</p></div>
                        <div style={
                            {
                                borderTop: '2px solid rgb(224, 224, 224)',
                                marginTop: '10px',
                                paddingTop: '8px',
                                fontSize: '1.2rem'
                            }
                        } className="subCont"><strong>Total:</strong> <h3><strong>&pound;{((parseFloat(invData.total) - parseFloat(invData.discount)) + parseFloat(invData.shipFee)).toFixed(2)}</strong></h3></div>
                    </div>
                </div>
                <div className="invoice-footer">
                    <div>
                        <h4><strong>Notes:</strong></h4>
                        <p>Thanks for being an awesome customer!</p>
                    </div>
                    <div>
                        <button onClick={printInvoice} className="btnPrint" type="button"><FontAwesomeIcon icon={faPrint} /> Print Invoice</button>
                    </div>
                </div>
            </div>
        )
    }
}