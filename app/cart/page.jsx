"use client"
import { useDataContext } from "@/context";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState, useLayoutEffect } from "react";

export default function CartPage() {
    const { cartData, removeItem, setCartData } = useDataContext()
    const [subTotal, setSubTotal] = useState(0)
    useEffect(() => {
        const totalP = document.querySelectorAll('#total')
        let arr = []
        totalP.forEach(ele => {
            arr.push(Number(ele.textContent.substring(1)))
        })
        let total = 0
        for (let i = 0; i < arr.length; i++) {
            total = total + arr[i]
        }
        setSubTotal(total)
    }, [cartData])
    if (cartData.length <= 0) {
        return (
            <>
                <div className="cartPage" style={{ padding: '200px 50px' }}>
                    <h1>{(cartData.length <= 0) ? 'Your Cart is empty' : 'Your Cart'}</h1>
                    <Link href={'/'}>Continue To Shopping</Link>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="cartPage">
                <h1>Your Cart</h1>
                <Link href={'/'}>Continue To Shopping</Link>
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
                                    <td colSpan={2}>
                                        <div className="tableProduct">
                                            <img src={data.imgUrl} alt="fsfsk" width={100} />
                                            <p>{data.title}</p>
                                        </div>
                                    </td>
                                    <td>${data.price}</td>
                                    <td>
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
                                    <td><FontAwesomeIcon onClick={() => removeItem(data.id)} style={{ fontSize: '1.5rem', cursor: 'pointer' }} icon={faTrash} /></td>
                                    <td id="total" style={{ textAlign: 'right' }}>${data.price * data.qty}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="checkoutCont">
                    <div className="subTotal">
                        <h3>SubTotal: ${subTotal}</h3>
                        <p>Taxes and shipping calculated at checkout</p>
                    </div>
                    <button type="button">Procceed To Checkout</button>
                </div>
            </div>
        </>
    )
}