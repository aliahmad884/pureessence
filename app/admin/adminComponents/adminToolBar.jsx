"use client"
import { useEffect, useState } from "react";
import { useAdminContext } from "../adminContext";
import { usePathname, useRouter } from "next/navigation";

export default function AdminToolbar() {
    const pathName = usePathname()
    const router = useRouter()
    const { isAuthUser, setIsAuthUser, isToggled, setIsToggled, loggedUser } = useAdminContext()
    const handleNav = () => {
        setIsToggled(true)
        let nav = document.querySelector('.adminNavCont')
        nav.classList.add('toggleNav')
    }
    const handleLogout = () => {
        setIsAuthUser(false)
        localStorage.removeItem('isLogged')
        localStorage.removeItem('loggedUser')
    }
    useEffect(() => {
        let nav = document.querySelector('.adminNavCont')
        const handleClickOutside = (event) => {
            if (isToggled && !nav.contains(event.target)) {
                nav.classList.remove('toggleNav')
                setIsToggled(false)
            }
        }
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }

    }, [isToggled])
    return (
        <>
            <div className="adminToolCont" style={pathName.startsWith('/admin/authenticate') ? { display: 'none' } : null}>
                <div className="toggleIcon">
                    <img onClick={handleNav} src="/iconImgs/menus.webp" alt="Icons" />
                </div>
                <div className="user" onClick={() => router.push('/admin/settings')}>
                    <div onClick={handleLogout} className="logout" title="Logout">
                        <i className="fi fi-rr-arrow-left-from-arc"></i>
                        <p>Logout</p>
                    </div>
                    <img src={loggedUser ? loggedUser.proImg : "/iconImgs/user.png"} alt="User" style={{ borderRadius: '50%' }} />
                    <p>{loggedUser ? loggedUser.username : 'Guest'}</p>
                </div>
            </div>
        </>
    )
}