'use client'
import { createContext, useContext, useState, useEffect } from "react"

export const ProgressContext = createContext();

export default function ProgressProvider({ children }) {
    const [currValue, setCurrValue] = useState(0)
    const windowScroll = () => {
        const clientHeight = document.documentElement.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        const scrolled = document.documentElement.scrollTop;

        const totalArea = scrollHeight - clientHeight;
        const scrolPer = (scrolled / totalArea) * 100
        setCurrValue(scrolPer)
    }
    useEffect(() => {
        document.addEventListener('scroll', windowScroll)
        return()=>{
            document.removeEventListener('scroll',windowScroll)
        }
    }, [])
    return (
        <ProgressContext.Provider value={{ currValue, setCurrValue }}>{children}</ProgressContext.Provider>
    )
}

export const useProgress = () => useContext(ProgressContext);