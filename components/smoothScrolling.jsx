'use client'

// import { ReactLenis } from "@studio-freight/react-lenis";
import { ReactLenis } from 'lenis/react'
// import { ReactLenis } from "@studio-freight/react-lenis"

export default function SmoothScroll({ children }) {
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1, smoothWheel: true, syncTouch: true }}>{children}</ReactLenis>
    )
}