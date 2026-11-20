"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faCartShopping } from "@fortawesome/free-solid-svg-icons"

import { useDataContext } from "@/context"
import ProgressLoader from "./progress"

const navLinks = [
    { link: 'Home', path: '/' },
    { link: 'Products', path: '/products' },
    { link: 'About', path: '/about' },
    { link: 'Guides', path: '/blogs/health-guides' },
    { link: 'Contact', path: '/contact' },
    { link: 'Blogs', path: '/blogs' },
    { link: 'FAQs', path: '/frequently-asked-questions' },
    // { link: 'Orders', path: '/order' }
]

// Same inline styles the old active-tab effect applied
const activeStyle = { color: '#dfb434', fontWeight: 'bolder', borderBottom: '3px solid' }
const inactiveStyle = { color: '', fontWeight: 'normal', borderBottom: 'none' }

// Rendered in both the desktop bar and the small-screen dropdown
function NavLinkItems({ pathName }) {
    return navLinks.map(navlink => (
        <Link
            data-value={navlink.path}
            key={navlink.link}
            href={navlink.path}
            className="navLinksItems"
            style={navlink.path === pathName ? activeStyle : inactiveStyle}
        >
            {navlink.link}
        </Link>
    ))
}

export default function Navbar() {
    const pathName = usePathname()
    const router = useRouter()
    const { cartData, loggedUser } = useDataContext()

    const [searchValue, setSearchValue] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isExtended, setIsExtended] = useState(false)

    const searchBarRef = useRef(null)
    const menuBtnRef = useRef(null)
    const dropSearchRef = useRef(null)
    const dropUserRef = useRef(null)

    // ---------- Search ----------
    const goToSearch = () => router.push(`/search?query=${searchValue}`)

    const handleSearchIcon = () => {
        if (isSearchOpen) goToSearch()
        else setIsSearchOpen(true)
    }

    const searchOnEnter = (event, callback) => {
        if (event.key === 'Enter' && searchValue.length > 0) callback()
    }

    const handleMobileSearch = () => {
        setIsMenuOpen(false)
        goToSearch()
    }

    const handleMenu = () => setIsMenuOpen(open => !open)

    useEffect(() => {
        if (!isMenuOpen) return

        const handleOutsideClick = (event) => {
            const isInside = [menuBtnRef, dropSearchRef, dropUserRef]
                .some(ref => ref.current?.contains(event.target))
            if (!isInside) {
                setIsMenuOpen(false)
                setIsExtended(false)
            }
        }

        document.addEventListener('click', handleOutsideClick)
        return () => document.removeEventListener('click', handleOutsideClick)
    }, [isMenuOpen])

    // ---------- Collapse the desktop search on outside click (only when empty) ----------
    useEffect(() => {
        if (!isSearchOpen || searchValue !== '') return

        const handleOutsideClick = (event) => {
            if (!searchBarRef.current?.contains(event.target)) setIsSearchOpen(false)
        }

        document.addEventListener('click', handleOutsideClick)
        return () => document.removeEventListener('click', handleOutsideClick)
    }, [isSearchOpen, searchValue])

    return (
        <>
            <ProgressLoader />
            <div className="navMainCont">
                {/* --------Nav Container-------- */}
                <div className="navContainer">
                    {/*------Company Logo------*/}
                    <div className="navLogo" onClick={() => router.push('/')}>
                        <img loading="lazy" src="/logos/PE-Main-Logo.png" alt="Logo" width={200} />
                    </div>
                    <div className="navMenu">
                        {/*-----Routes Link------*/}
                        <div className="navLinks">
                            <NavLinkItems pathName={pathName} />
                        </div>
                        {/* --------Small Navbar Menu Button------- */}
                        <div
                            id="barBtn"
                            ref={menuBtnRef}
                            onClick={handleMenu}
                            className={`menuBtn${isMenuOpen ? ' open' : ''}`}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        {/* ---------Search Bar--------- */}
                        <div className="searchBar" ref={searchBarRef}>
                            <input
                                onKeyDown={(event) => searchOnEnter(event, () => isSearchOpen && goToSearch())}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className={isSearchOpen ? 'show' : undefined}
                                type="search"
                                value={searchValue}
                                id="search"
                                placeholder="Search"
                            />
                            <FontAwesomeIcon
                                className="searchIcon"
                                style={isSearchOpen ? { color: '#dfb434' } : undefined}
                                onClick={handleSearchIcon}
                                icon={faMagnifyingGlass}
                            />
                        </div>
                        {/* -------Cart--------- */}
                        <div onClick={() => router.push('/cart')} className="cartCont">
                            <div className="count">{cartData.length}</div>
                            <FontAwesomeIcon style={{ fontSize: '1.5rem', paddingTop: '7px' }} icon={faCartShopping} />
                        </div>
                        {/* -------Active User------- */}
                        <div className="userCont">
                            {loggedUser
                                ? <Link href={'/profile'}><img loading="lazy" src={loggedUser.profile_pic ? loggedUser.profile_pic : "/avatar2.webp"} alt="Temp" width={40} className="rounded-full cursor-pointer" /></Link>
                                : <p style={{ cursor: 'pointer' }}><Link href={'/login'}>Login</Link></p>
                            }
                        </div>
                    </div>
                </div>

                {/* -------Small Navbar Routes DropDown-------- */}
                <div className={`routerDropDown${isMenuOpen ? ' drop' : ''}${isExtended ? ' extend' : ''}`}>
                    <NavLinkItems pathName={pathName} />
                    {/* --------DropDown Search Bar-------- */}
                    <div className="dropSearch" ref={dropSearchRef} style={{ flexFlow: 'row nowrap' }}>
                        <input
                            onKeyDown={(event) => searchOnEnter(event, handleMobileSearch)}
                            onChange={(e) => setSearchValue(e.target.value)}
                            type="search"
                            value={searchValue}
                            id="search"
                            placeholder="Search"
                        />
                        <FontAwesomeIcon
                            style={{ cursor: 'pointer', margin: '0 15px' }}
                            onClick={handleMobileSearch}
                            icon={faMagnifyingGlass}
                        />
                    </div>
                    <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* --------DropDown Cart-------- */}
                        <div onClick={() => router.push('/cart')} className="dropCart">
                            <div className="count">{cartData.length}</div>
                            <FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={faCartShopping} />
                        </div>
                        {/* --------DropDown User-------- */}
                        <div className="dropUser" ref={dropUserRef}>
                            {loggedUser ? (<>
                                <img onClick={() => router.push("/profile")} loading="lazy" src={loggedUser.profile_pic ? loggedUser.profile_pic : "/avatar2.webp"} alt="Temp" width={40} />
                            </>) :
                                <p style={{ cursor: 'pointer', margin: '10px 0' }}><Link href={'/login'}>Login</Link></p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
