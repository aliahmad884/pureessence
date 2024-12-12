"use client"
import { useEffect, useState } from "react"
import { useAdminContext } from "../adminContext"
import { usePathname, useRouter } from "next/navigation"
import { BlindsFallBack } from "@/components/loader"

export default function Settings() {
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
            <div className="adminRoute full">
                <h1>Settings</h1>
            </div>
        </>
    )
}