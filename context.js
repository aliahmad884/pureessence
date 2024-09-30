"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export default function ContextProvider({ children }) {
    const router = useRouter()
    const [innerWidth, setInnerWidth] = useState(2200);
    const [cartData, setCartData] = useState([]);
    const [isLogged, setIsLogged] = useState(false)
    const [loggedUser, setLoggedUser] = useState(null)
    const [isResDelay, setResDelay] = useState(false)
    const [isLogout, setIsLogout] = useState(false)
    const [DOMLoaded, SetDOMLoaded] = useState(false)
    useEffect(() => {
        let user = localStorage.getItem('user')
        if (user) {
            setLoggedUser(JSON.parse(user))
            fetch('/api/userCart').then(res => {
                if (res.status === 401) {
                    localStorage.removeItem('user')
                    setCartData([])
                    return null;
                }
                return res.json()
            }).then(result => {
                if (result) setCartData(result.cartData);
                setIsLogged(false)
            }).catch(err => console.log(err))
        } else {
            console.log('without login')
            localStorage.removeItem('user')
            const storedCart = localStorage.getItem('cart')
            if (storedCart) {
                setCartData(JSON.parse(storedCart))
            }
        }
    }, [isLogged, isLogout])
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
                setIsLogged,
                isResDelay,
                isLogged,
                setIsLogout,
                DOMLoaded,
                SetDOMLoaded
            }
        }>
            {children}
        </DataContext.Provider>
    )
}
export const useDataContext = () => useContext(DataContext);