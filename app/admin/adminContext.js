'use client'

import { useRouter } from "next/navigation"

const { createContext, useContext, useState, useEffect } = require("react")

const AdminContext = createContext()

export default function AdminContextProvider({ children }) {
    const router = useRouter()
    const [isToggled, setIsToggled] = useState(false)
    const [isAuthUser, setIsAuthUser] = useState(false);
    // useEffect(() => {
    //     if (!isAuthUser) router.push('/admin/authenticate');
    // }, [isAuthUser])
    return (
        <AdminContext.Provider value={{ isToggled, setIsToggled, isAuthUser, setIsAuthUser }}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdminContext() {
    return useContext(AdminContext)
}
// export function checkAuthStatus() {
//     if (!isAuthUser) router.push('/admin/authenticate');
// }