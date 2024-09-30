"use client"
import Link from "next/link"
import { useEffect } from "react"

export default function ProductPage() {
    // useEffect(() => {
    //     console.log(params)
    // }, [])
    return (
        <>
            <div className="productPageBanner">
                <h1>Products</h1>
            </div>
            {/* <h1>Product Page</h1>
            <Link href={'/products/categories/hello'}>Hello</Link>
            <Link href={'/products/categories/world'}>World</Link> */}
        </>
    )
}