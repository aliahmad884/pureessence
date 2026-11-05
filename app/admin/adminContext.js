'use client'

import { useRouter } from "next/navigation"

const { createContext, useContext, useState, useEffect } = require("react")

const AdminContext = createContext()

export default function AdminContextProvider({user, children }) {
    const router = useRouter()
    const [isToggled, setIsToggled] = useState(false)
    const [isAuthUser, setIsAuthUser] = useState(true);
    return (
        <AdminContext.Provider value={{ isToggled, setIsToggled, isAuthUser, setIsAuthUser, loggedUser:user}}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdminContext() {
    return useContext(AdminContext)
}