'use client'
import { useProgress } from "@/progresscontext"
import { useEffect } from "react"

export default function ProgressLoader() {
    const { currValue } = useProgress()
    useEffect(()=>{
        let bar=document.getElementById('progressbar');
        if(bar){
            bar.style.width=`${currValue}%`
        }
    },[currValue])
    return (
        <>
            <div className="progressBar h-[8px] bg-[#dfb434] fixed top-0 left-0 z-[100]" id="progressbar"></div>
        </>
    )
}   