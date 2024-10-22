"use client"
import { ProductCard } from "@/components/cards"
import FallBackLoader from "@/components/loader"
import ProductData from "@/data"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import dynamic from "next/dynamic"

export default function ProductPage() {
    const [isLoading, setIsLoading] = useState(true)
    const data = ProductData
    useEffect(() => {
        setIsLoading(false)
    }, [])
    if (isLoading) return <FallBackLoader />
    return (
        <>
            <Toaster />
            <div className="productPageBanner">
                <h1>Products</h1>
            </div>
            <div className="productPage">
                <div className="productsCont">
                    {
                        data.map(data => <ProductCard key={data.id} id={data.id} price={data.price} imgUrl={data.imgUrl} title={data.title} qty={data.qty} data={data} shortDes={data.shortDes} slug={data.slug} />)
                    }
                </div>
            </div>
        </>
    )
}