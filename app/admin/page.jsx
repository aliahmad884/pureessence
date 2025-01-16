'use client'

import { useEffect, useState } from "react"
import { useAdminContext } from "./adminContext"
import { usePathname, useRouter } from "next/navigation"
import { BlindsFallBack } from "@/components/loader"

export default function AdminHome() {
    const { isAuthUser } = useAdminContext()
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthe, setIsAuth] = useState(true)
    useEffect(() => {
        if (!isAuthUser) router.push(`/admin/authenticate?path=${pathname}`);
        else setIsAuth(false);
    }, [isAuthUser])
    if (isAuthe) return <BlindsFallBack />
    return (
        <>
            <div className="adminRoute dashboard">
                <div className="welcomeCont">
                    <h1>Welcome to the Admin Panel!</h1>
                    <p>This is your central hub for managing everything efficiently. Explore the features and take control of your platform with ease.</p>
                </div>
            </div>
        </>
    )
}