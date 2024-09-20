"use client";

const { useContext, createContext, useState, useEffect } = require("react");
const DataContext = createContext();

export default function ContextProvider({ children }) {
    const [innerWidth, setInnerWidth] = useState(2200);
    const [cartData, setCartData] = useState([]);
    useEffect(() => {
        // localStorage.clear('cart')
        const storedCart = localStorage.getItem('cart')
        if (storedCart) {
            setCartData(JSON.parse(storedCart))
        }
    }, [])
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
            localStorage.setItem('cart',JSON.stringify(updateData))
        }
    }
    return (
        <DataContext.Provider value={{ innerWidth, setInnerWidth, cartData, setCartData, removeItem }}>
            {children}
        </DataContext.Provider>
    )
}
export const useDataContext = () => useContext(DataContext);