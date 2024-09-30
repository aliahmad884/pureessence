"use client"
import { useEffect } from "react"

export default function CategoryPage({ params }) {
    const { slug } = params
    // useEffect(() => {
    //     console.log(params)
    //     console.log(slug)
    // }, [])
    return (
        <>
            <h1>Route: {slug}</h1>
        </>
    )
}