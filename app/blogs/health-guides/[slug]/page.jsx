"use client"
import { useEffect } from "react";

export default function HealthGuideSlug({ params }) {
    const { slug } = params;
    const decodedSlug = decodeURIComponent(slug)
    useEffect(() => {
        console.log(decodedSlug)
    }, [])
    return (
        <>
            <h1 style={{ padding: '150px 50px', textAlign: 'center', fontSize: '2.5rem' }}>{decodedSlug}</h1>
        </>
    )
}