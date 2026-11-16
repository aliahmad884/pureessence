"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export default function ContextProvider({ user, children }) {
    const router = useRouter()
    const [innerWidth, setInnerWidth] = useState(2200);
    const [cartData, setCartData] = useState([]);
    const [loggedUser, setLoggedUser] = useState(user)
    const [isResDelay, setResDelay] = useState(false)


    const loadCart = async () => {
        try {
            if (loggedUser) {
                const res = await fetch('/api/userCart')
                const result = await res.json()
                console.log(result)
                if (!res.ok) {
                    setCartData([])
                    return null;
                }
                setCartData(result.cartData);
            }
            else {
                const storedCart = localStorage.getItem('cart')
                if (storedCart) {
                    setCartData(JSON.parse(storedCart))
                }
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        loadCart()
    }, [loggedUser])

    useEffect(() => {
        try {
            if (cartData.length > 0) {
                localStorage.setItem('cart', JSON.stringify(cartData))
            }
        } catch (e) {
            if (e.code === 22 || e.name === 'QuotaExceededError') {
                console.error('Local Storage limit exceeded!')
            }
        }
    }, [cartData])
    const removeItem = (itemName) => {
        if (cartData.length < 2) {
            localStorage.removeItem('cart')
            setCartData([])
        } else {
            const updateData = cartData.filter(item => item.id !== itemName)
            setCartData(updateData)
            localStorage.setItem('cart', JSON.stringify(updateData))
        }
        if (loggedUser) {
            setResDelay(true)
            fetch('/api/userCart', {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: itemName, user: loggedUser.Email })
            }).then(res => {
                setResDelay(false)
                return res.json();
            }).then(result => console.log(result)).catch(err => {
                setResDelay(false)
                console.log(err)
            })
        }
    }
    return (
        <DataContext.Provider value={
            {
                innerWidth,
                setInnerWidth,
                cartData,
                setCartData,
                removeItem,
                loggedUser,
                setLoggedUser,
                isResDelay,
            }
        }>
            {children}
        </DataContext.Provider>
    )
}
export const useDataContext = () => useContext(DataContext);