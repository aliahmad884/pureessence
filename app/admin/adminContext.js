'use client'

const { createContext, useContext, useState } = require("react")

const AdminContext = createContext()

export default function AdminContextProvider({ children }) {
    const [isToggled, setIsToggled] = useState(false)
    return (
        <AdminContext.Provider value={{ isToggled, setIsToggled }}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdminContext() {
    return useContext(AdminContext)
}