'use client'

import Navbar from "@/components/navbar";
import ToolBar from "@/components/toolbar";
import Footer from "@/components/footer";
import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import FallBackLoader from "@/components/loader";
import Whatsapp from "@/components/whatsapp";
import SmoothScroll from "@/components/smoothScrolling";
import ProgressProvider from "@/progresscontext";
import { Toaster } from "@/components/ui/sonner";

const excludedRoutes = [
    "/admin",
    "/login",
    "/signup",
    "/completed",
    "/auth",
    "/invoice"
];

export default function LayoutClient({ children }) {
    const pathName = usePathname()

    const isAdmin = pathName.startsWith('/admin')
    const showNavbarAndToolBar = !excludedRoutes.some(route => pathName.startsWith(route));
    const showFooter = ![...excludedRoutes, '/profile'].some(route => pathName.startsWith(route));
    const showWhatsapp = !(pathName.startsWith("/invoice") || isAdmin);

    useEffect(() => {
        if (!isAdmin) return
        const prevColor = document.body.style.color
        const prevBackground = document.body.style.background
        document.body.style.color = '#171717'
        document.body.style.background = '#ffffff'
        return () => {
            document.body.style.color = prevColor
            document.body.style.background = prevBackground
        }
    }, [isAdmin])

    const content = (
        <>
            <Toaster position="top-center" />
            {showNavbarAndToolBar && (
                <>
                    <ToolBar />
                    <Navbar />
                </>
            )}
            {showWhatsapp && <Whatsapp />}
            {children}
            {showFooter && <Footer />}
        </>
    )

    return (

        <SmoothScroll>
            <ProgressProvider>
                <Suspense fallback={<FallBackLoader />}>
                    {isAdmin ? (
                        <div style={{ color: '#171717', background: '#ffffff', minHeight: '100vh' }}>
                            {content}
                        </div>
                    ) : content}
                </Suspense>
            </ProgressProvider>
        </SmoothScroll>
    )
}