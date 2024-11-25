"use client"
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useAdminContext } from "../adminContext";
import { usePathname } from "next/navigation";

export default function AdminToolbar() {
    const pathName= usePathname()
    const { isToggled, setIsToggled } = useAdminContext()
    const handleNav = () => {
        setIsToggled(true)
        let nav = document.querySelector('.adminNavCont')
        nav.classList.add('toggleNav')
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
                <div className="user">
                    <img src="/iconImgs/user.png" alt="User" />
                    <p>Haji Robert Wilson</p>
                </div>
            </div>
        </>
    )
}