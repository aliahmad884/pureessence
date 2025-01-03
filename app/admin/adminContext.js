'use client'

import { useRouter } from "next/navigation"

const { createContext, useContext, useState, useEffect } = require("react")

const AdminContext = createContext()

export default function AdminContextProvider({ children }) {
    const router = useRouter()
    const [isToggled, setIsToggled] = useState(false)
    const [isAuthUser, setIsAuthUser] = useState(true);
    const [loggedUser, setLoggedUser] = useState(null)
    useEffect(() => {
        // localStorage.removeItem('isLogged')
        const user = localStorage.getItem('loggedUser');
        setLoggedUser(JSON.parse(user))
        const isLogged = localStorage.getItem('isLogged')
        if (isLogged === 'true') setIsAuthUser(true)
        else setIsAuthUser(false)
    }, [])
    return (
        <AdminContext.Provider value={{ isToggled, setIsToggled, isAuthUser, setIsAuthUser, loggedUser, setLoggedUser }}>
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