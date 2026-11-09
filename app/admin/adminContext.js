'use client'

import { useRouter } from "next/navigation"

import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext()

export default function AdminContextProvider({ user, children }) {
    const [isToggled, setIsToggled] = useState(false);
    const [isAuthUser, setIsAuthUser] = useState(true);
    const [loggedUser, setLoggedUser] = useState(user)

    useEffect(() => {
        setLoggedUser(user)
    }, [user])
    return (
        <AdminContext.Provider value={{ isToggled, setIsToggled, isAuthUser, setIsAuthUser, loggedUser, setLoggedUser }}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdminContext() {
    return useContext(AdminContext);
}