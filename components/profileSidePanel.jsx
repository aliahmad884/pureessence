"use client"
import { useDataContext } from "@/context"
import { faGripVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"



export default function ProfileSidePanel() {
    const router = useRouter()
    const pathName = usePathname()
    const { loggedUser } = useDataContext()
    const [isClicked, setIsClicked] = useState(false)
    const [isDomLoaded, setIsDomLoaded] = useState(false)
    const handleSidePanel = () => {
        let panel = document.querySelector('.sidePanel')
        let icon = document.querySelector('.toggleIcon')
        panel.classList.add('toggle')
        icon.style.display = 'none'
        setIsClicked(true)
    }
    if (isDomLoaded) {
        document.addEventListener('click', (event) => {
            let panel = document.querySelector('.sidePanel')
            let icon = document.querySelector('.toggleIcon')
            if (isClicked && panel && !panel.contains(event.target)) {
                panel.classList.remove('toggle')
                icon.removeAttribute('style')
                setIsClicked(false)
            }
        })
    }
    useEffect(() => {
        let user = localStorage.getItem('user')
        if (!user) {
            router.push('/login?retTo=/profile')
        }
        setIsDomLoaded(true)
        let optionsCont = document.querySelector('.optionsCont')
        let profileLinks = optionsCont.querySelectorAll('a')
        profileLinks.forEach(link => {
            link.style.color = ''
            link.style.fontWeight = 'normal'
            if (link.dataset.value === pathName) {
                link.style.color = '#dfb434'
                link.style.fontWeight='bold'
            }
        })

        return () => (document.body.style.overflow = 'auto');
    }, [loggedUser])

    return (
        <>
            <div className="sidePanel">
                <div onClick={handleSidePanel} className="toggleIcon"><i className="fi fi-br-angle-double-right"></i></div>
                <div className="proImgCont">
                    <img loading="lazy" src="/avatar2.webp" alt="Avatar" />
                    <h1>{loggedUser ? loggedUser.Name : 'Guest User'}</h1>
                </div>
                <div className="optionsCont">
                    <h2>Manage My Account</h2>
                    <Link data-value={'/profile'} href={'/profile'}>Edit Profile</Link>
                    {/* <Link data-value={'/profile/address-book'} href={'/profile/address-book'}>Address Book</Link> */}
                    {/* <h2>My Orders</h2> */}
                    <Link data-value={'/profile/my-orders'} href={'/profile/my-orders'}>My Orders</Link>
                    {/* <Link data-value={'/profile/my-cancellations'} href={'/profile/my-cancellations'}>My Cancellations</Link>
                    <Link data-value={'/profile/my-returns'} href={'/profile/my-returns'}>My Returns</Link> */}
                </div>
            </div>
        </>
    )
}