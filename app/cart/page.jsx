"use client"
import FallBackLoader from "@/components/loader";
import { useDataContext } from "@/context";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
    const router = useRouter()
    const { cartData, removeItem, setCartData, isResDelay } = useDataContext()
    const [subTotal, setSubTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    const handleCheckout = () => {
        router.push(`/shipping`)
    }
    useEffect(() => {
        document.title = 'Cart'
        setLoading(false)
        let arr = []
        cartData.forEach(ele => {
            arr.push(Number(ele.price) * ele.qty)
        })
        let total = arr.reduce((prev, curr) => prev + curr, 0)
        setSubTotal(total)
    }, [cartData])

    if (loading) return <FallBackLoader />

    if (cartData.length <= 0) {
        return (
            <>
                <div className="cartPage" style={{ padding: '200px 50px' }}>
                    <h1>{(cartData.length <= 0) ? 'Your Cart is empty' : 'Your Cart'}</h1>
                    <Link href={'/products'}>Continue Shopping</Link>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="cartPage">
                <h1>Your Cart</h1>
                <Link href={'/products'}>Continue Shopping</Link>
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }} colSpan={2}>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Action</th>
                            <th style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cartData.map((data, index) => (
                                <tr key={data.id}>
                                    <td data-label='Product' colSpan={2}>
                                        <div className="tableProduct">
                                            <img loading="lazy" src={`/api/uploadImg?path=${encodeURIComponent(data.pImages ? data.pImages[0] : data.imgUrl)}`} alt={data.pName ? data.pName : data.title} width={100} />&nbsp;
                                            <p><Link href={`/products/${data.slug}`} target="_blank">{data.pName ? data.pName : data.title}</Link></p>
                                        </div>
                                    </td>
                                    <td data-label='Price'>&pound;{data.price}</td>
                                    <td data-label='Quantity'>
                                        <div className="innerBtn">
                                            <button onClick={() => {
                                                if (data.qty > 1) {
                                                    const updateCart = cartData.map((item, i) =>
                                                        i === index ? { ...item, qty: item.qty - 1 } : item
                                                    )
                                                    setCartData(updateCart)
                                                }
                                            }} type="button">-</button>
                                            <p>{data.qty}</p>
                                            <button onClick={() => {
                                                const updateCart = cartData.map((item, i) => i === index ? { ...item, qty: item.qty + 1 } : item)
                                                setCartData(updateCart)
                                            }} type="button">+</button>
                                        </div>
                                    </td>
                                    <td data-label='Action'>
                                        {isResDelay ? '....' : (
                                            <FontAwesomeIcon
                                                id="trash"
                                                onClick={() => removeItem(data.id)}
                                                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                                                icon={faTrash}
                                            />
                                        )}
                                    </td>
                                    <td data-label='Total' id="total" style={{ textAlign: 'right' }}>&pound;{
                                        (data.price * data.qty).toLocaleString('en-GB',
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )
                                    }</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="checkoutCont">
                    <div className="subTotal">
                        <h3>SubTotal: &pound;{subTotal}</h3>
                        <p>Taxes and shipping calculated at checkout</p>
                    </div>
                    <button onClick={handleCheckout} type="button">Procceed To Checkout</button>
                </div>
                <div className="acceptPay">
                    <p>Payment Methods Accepted Here:</p>
                    <div className="payCards">
                        <Image src="/iconImgs/applePay.webp" alt="Apple Pay" sizes="100vw" style={{ width: '50px', height: '100%' }} height={0} width={0} />
                        <Image src="/iconImgs/masterCard.webp" alt="Master Card" sizes="100vw" style={{ width: '50px', height: '100%' }} height={0} width={0} />
                        <Image src="/iconImgs/visaCard.webp" alt="Visa" sizes="100vw" style={{ width: '50px', height: '100%' }} height={0} width={0} />
                    </div>
                </div>
            </div>
        </>
    )
}
