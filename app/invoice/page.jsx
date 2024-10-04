import Link from "next/link"
import "./invoiceStyle.css"

export default function Invoice() {
    return (
        <div className="invoice">
            <div className="invoice-header">
                <div>
                    <h1>Invoice</h1>
                    <h3 style={{ textAlign: 'right' }}>PE-INV-0001</h3>
                    <h2><strong>Date:</strong> 30-Sep-24</h2>
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
                    <p><strong>Name: </strong>John Doe</p>
                    <p><strong>Email: </strong>jhondoe@gmail.com</p>
                    <p><strong>Phone: </strong>1234567891234</p>
                    <p><strong>Address: </strong>Kings court 33 king street BB2 2DH</p>
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
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Example line item */}
                        <tr>
                            <td>Product 1</td>
                            <td>1</td>
                            <td>$10.00</td>
                            <td>$10.00</td>
                        </tr>
                        {/* Add more line items as needed */}
                    </tbody>
                </table>
            </div>
            <div className="amount-container">
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="subCont"><strong>Subtotal:</strong><p>$95.05</p></div>
                    <div className="subCont"><strong>Shipping:</strong><p>$15.00</p></div>
                    <div className="subCont"><strong>Tax(if Applicable):</strong><p>$0.00</p></div>
                    <div className="subCont"><strong>Discount:</strong><p>$00.00</p></div>
                    <div style={{ borderTop: '2px solid rgb(224, 224, 224)', marginTop: '10px', paddingTop: '8px', fontSize: '1.2rem' }} className="subCont"><strong>Total:</strong><p>$110.05</p></div>
                </div>
            </div>
            <div className="invoice-footer">
                {/* Invoice total */}
                <h4><strong>Notes:</strong></h4>
                <p>Thanks for being an awesome customer!</p>
                {/* Any additional notes or terms */}
                <h4><strong>Terms:</strong></h4>
                <p>Payment due in 30 days.</p>
            </div>
        </div>
    )
}