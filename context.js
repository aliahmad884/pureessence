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
            console.log(storedCart)
        }
    }, [])
    useEffect(() => {
        try {
            if (cartData.length > 0) {
                localStorage.setItem('cart', JSON.stringify(cartData))
                console.log(cartData)
            }
        } catch (e) {
            if (e.code === 22 || e.name === 'QuotaExceededError') {
                console.error('Local Storage limit exceeded!')
            }
        }
    }, [cartData])
    return (
        <DataContext.Provider value={{ innerWidth, setInnerWidth, cartData, setCartData }}>
            {children}
        </DataContext.Provider>
    )
}
export const useDataContext = () => useContext(DataContext);