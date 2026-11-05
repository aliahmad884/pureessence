"use client"
import { useEffect, use } from "react";

export default function CategoryPage(props) {
    const params = use(props.params);
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