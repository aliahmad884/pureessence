"use client"
import { ProductCard } from "@/components/cards"
import ProductData from "@/data"
import Link from "next/link"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"

export default function ProductPage() {
    const data = ProductData
    // useEffect(() => {
    //     console.log(params)
    // }, [])
    return (
        <>
            <Toaster />
            <div className="productPageBanner">
                <h1>Products</h1>
            </div>
            <div className="productPage">
                <div className="productsCont">
                    {
                        data.map(data => <ProductCard key={data.id} id={data.id} imgUrl={data.imgUrl} title={data.title} price={data.price} qty={data.qty} data={data} shortDes={data.shortDes} slug={data.slug} />)
                    }
                </div>
            </div>
        </>
    )
}