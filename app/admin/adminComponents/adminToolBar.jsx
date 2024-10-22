"use client"
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function AdminToolbar() {
    const [isToggled, setIsToggled] = useState(false);
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
                console.log('function called')
            }
        }
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }

    }, [isToggled])
    return (
        <>
            <div className="adminToolCont">
                <div className="toggleIcon">
                    <img onClick={handleNav} src="/icons/menus.webp" alt="Icons" />
                </div>
                <div className="user">
                    <img src="/user.png" alt="User" />
                    <p>Haji Robert Wilson</p>
                </div>
            </div>
        </>
    )
}