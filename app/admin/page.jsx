'use client'

import { useEffect } from "react"
import { useAdminContext } from "./adminContext"
import { useRouter } from "next/navigation"

export default function AdminHome() {
    const { isAuthUser } = useAdminContext()
    const router = useRouter()
    useEffect(() => {
        if (!isAuthUser) router.push('/admin/authenticate')
    }, [isAuthUser])

    return (
        <>
            <div className="adminRoute full">
                <h1>Welcome to Admin Home...!</h1>
                <p>lore ipsume sit doller ammit huush</p>
            </div>
        </>
    )
}