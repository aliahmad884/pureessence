import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Checkout() {
    return (
        <>
            <h1>Checkout</h1>
            <div className="manageMainCont">
                <h1>Preview Order</h1>
                <div className="subCont">
                    <div className="header">
                        <h2>OrderID: #412</h2>
                        {/* <div className="badge">Status</div> */}
                    </div>
                    <div className="orderDetail">
                        <h2>Order Details</h2>
                        <div className="product">
                            <div className="title">
                                <img src='/shilajit.webp' alt='gajdga' width={60} />
                                <p>sssadxs</p>
                            </div>
                            <div className="price"><strong>Price: </strong><p>$</p></div>
                            <div className="qty"><strong>Qty: </strong><p></p></div>
                            <div className="total"><strong>Total: </strong><p>$</p></div>
                        </div>
                    </div>
                    {/* <div className="orderPlaceDesc">
                            <h2>Order Status</h2>
                            <div className="orderStatus">
                                <div className="date">
                                    <p><strong>OrderID: </strong></p>
                                    <p><strong>Placed on: </strong></p>
                                    <p><strong>Paid on: </strong> </p>
                                    <p><strong>Delivered on: </strong> 67</p>
                                    <p><strong>Completed on: </strong> 87897</p>
                                    <p><strong>Paid by: </strong> amazon_pay</p>
                                </div>
                                <div className="actionCont">
                                    <button disabled style={{ backgroundColor: '#dfb434' }} type="button">Cancel</button>
                                    <FontAwesomeIcon className="infoIcon" icon={faCircleInfo} />
                                    <div className="infomsg">lorem ipsum</div>
                                    <button type="button">Write An Review</button>
                                </div>
                            </div>
                        </div> */}
                    <div className="orderSummary">
                        <h2>Summary</h2>
                        <div className="ordersummaryCont">
                            <div className="shipCont">
                                <p><strong>Name: </strong>5445645</p>
                                <p><strong>Ship to: </strong>545455</p>
                                <p><strong>Phone: </strong>897988789897</p>
                                <p><strong>Email: </strong>897988789897</p>
                            </div>
                            <div className="orderTotal">
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>SubTotal: </strong><p>65464</p></div>
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Shipping Fee: </strong><p>120</p></div>
                                <div style={{ borderTop: "2px solid rgb(224, 224, 224)", display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}><strong>Total: </strong><p>452156</p></div>
                                {/* <div style={{ color: '#607274', fontSize: 'small' }}><p>Paid by amazon_pay</p></div> */}
                            </div>
                        </div>
                    </div>
                    <div className="btnAction">
                        <button className="cancelBtn" type="button">Cancel</button>
                        <div className="confirmCont">
                            <button className="btnInvoice" type="button">Generate Invoice</button>
                            <button className="btnConfirm" type="button">Confirm Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}