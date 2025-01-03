"use client"

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faUser, faRightToBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDataContext } from "@/context";
import FallBackLoader from "./loader";

export default function Navbar() {
    const pathName = usePathname();
    const router = useRouter()
    const { innerWidth, setInnerWidth, cartData, loggedUser, DOMLoaded, SetDOMLoaded } = useDataContext()
    const [inputEle, setInputEle] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [domLoaded, setDomLoaded] = useState(false)
    const navLinks = [
        { link: 'Home', path: '/' },
        { link: 'Products', path: '/products' },
        { link: 'About', path: '/about' },
        { link: 'Guides', path: '/blogs/health-guides' },
        { link: 'Contact', path: '/contact' },
        { link: 'Blogs', path: '/blogs' },
        { link: 'FAQs', path: '/frequently-asked-questions' }
    ];
    const handleSearch = () => {
        if (inputEle) {
            inputEle.classList.add('show')
            inputEle.nextSibling.style.color = '#dfb434'
        }
    }
    let isDropped = false;
    const handleMenu = (event) => {
        event.stopPropagation();
        let droplinks = document.querySelector('.routerDropDown');
        let menuBtn = document.getElementById('barBtn');
        menuBtn.classList.toggle('open')
        droplinks.classList.toggle('drop')
        isDropped = true
    }

    const handleExtend = (event) => {
        event.stopPropagation();
        let droplinks = document.querySelector('.routerDropDown');
        droplinks.classList.toggle('extend')
    }

    const handleLogout = () => {
        SetDOMLoaded(true)
        fetch('/api/user?action=logout', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({ req: "Logout Request" })
        }).then(res => {
            if (res.ok) {
                localStorage.removeItem('user')
                localStorage.removeItem('cart')
                setTimeout(() => {
                    window.location.reload()
                }, 1500)

            }
            return res.json()
        }).then(result => {
            console.log(result)
        }).catch(err => console.log(err));
    }
    let isCalled = false;
    const handleUserDrop = (event) => {
        event.stopPropagation()
        let userMenu = document.querySelector('.userMenu')
        if (!loggedUser) return null;
        else {
            userMenu.classList.toggle('active')
            isCalled = true;
        }
    }

    if (domLoaded) {
        document.addEventListener('click', (event) => {
            let userMenu = document.querySelector('.userMenu')
            let btn = document.querySelector('.userCont')
            let droplinks = document.querySelector('.routerDropDown');
            let menuBtn = document.getElementById('barBtn');
            let serchBar = document.querySelector('.dropSearch')
            let userDrop = document.querySelector('.dropUser')
            if (isCalled && userMenu && btn && !userMenu.contains(event.target) && !btn.contains(event.target)) {
                userMenu.classList.remove('active')
                isCalled = false
            }
            if (isDropped && userMenu && menuBtn && serchBar && userDrop &&
                !userMenu.contains(event.target) && !menuBtn.contains(event.target) &&
                !serchBar.contains(event.target) && !userDrop.contains(event.target)) {
                droplinks.classList.remove('drop')
                menuBtn.classList.remove('open')
                droplinks.classList.remove('extend')
                isDropped = false
            }
        })
    }

    useEffect(() => {
        setDomLoaded(true)
        SetDOMLoaded(false)
        let droplinks = document.querySelector('.routerDropDown');
        let menuBtn = document.getElementById('barBtn');
        let input = document.getElementById('search');
        let docBody = document.documentElement;
        setInputEle(input);

        const handleClose = (event) => {
            if (input && searchValue === '' && !event.target.closest('#search')) {
                input.classList.remove('show');
                input.nextSibling.style.color = ''
            };
        };
        const handleWindow = () => {
            setInnerWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleWindow);
        if (innerWidth >= 950 && menuBtn && menuBtn.classList.contains('open')) {
            menuBtn.classList.remove('open');
            droplinks.classList.remove('drop');
            droplinks.classList.remove('extend');
        } else if (innerWidth >= 650 && menuBtn && menuBtn.classList.contains('open')) {
            droplinks.classList.remove('extend');
        }

        docBody.addEventListener('click', handleClose);
        return () => {
            docBody.removeEventListener('click', handleClose);
            window.removeEventListener("resize", handleWindow);
        };

    }, [searchValue, innerWidth, loggedUser, pathName, cartData])

    // --------- Active Tab Handler-------------//
    useEffect(() => {
        let navLinks = document.querySelectorAll('.navLinksItems')
        navLinks.forEach(link => {
            link.style.color = ''
            link.style.fontWeight = 'normal'
            link.style.borderBottom = 'none'
            if (link.dataset.value === pathName) {
                link.style.color = '#dfb434'
                link.style.fontWeight = 'bolder'
                link.style.borderBottom = '3px solid'
            }
        })
    }, [pathName, loggedUser, cartData])
    if (DOMLoaded) {
        return <FallBackLoader />
    }
    return (
        <>
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
                            {
                                navLinks.map(navlink => <Link
                                    data-value={navlink.path}
                                    key={navlink.link}
                                    href={navlink.path}
                                    className="navLinksItems"
                                >{navlink.link}</Link>)
                            }
                        </div>
                        {/* --------Small Navbar Menu Button------- */}
                        <div id="barBtn" onClick={handleMenu} className="menuBtn">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        {/* ---------Search Bar--------- */}
                        <div className="searchBar">
                            <input onChange={(e) => setSearchValue(e.target.value)} type="search" value={searchValue} id="search" placeholder="Search"/>
                            <FontAwesomeIcon className="searchIcon" onClick={handleSearch} icon={faMagnifyingGlass} />
                        </div>
                        {/* -------Cart--------- */}
                        <div onClick={() => router.push('/cart')} className="cartCont">
                            <div className="count">{cartData.length}</div>
                            <FontAwesomeIcon style={{ fontSize: '1.5rem', paddingTop: '7px' }} icon={faCartShopping} />
                        </div>
                        {/* -------Active User------- */}
                        <div onClick={handleUserDrop} className="userCont">
                            {loggedUser ? <img loading="lazy" src="/avatar2.webp" alt="Temp" width={40} /> : <p style={{ cursor: 'pointer' }}><Link href={'/login'}>Login</Link></p>}
                            <div className="userMenu">
                                {loggedUser &&
                                    <>
                                        <h3>{loggedUser.Name}</h3>
                                        <ul>
                                            <li>
                                                <Link href={'/profile'}><FontAwesomeIcon style={{ color: 'black' }} icon={faUser} /> My profile</Link>
                                            </li>
                                            <li onClick={handleLogout}>
                                                <p><FontAwesomeIcon style={{ transform: 'rotate(180deg)', color: 'black' }} icon={faRightToBracket} /> Logout</p>
                                            </li>
                                        </ul>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* -------Small Navbar Routes DropDown-------- */}
                <div className="routerDropDown">
                    {
                        navLinks.map(navlink => <Link
                            data-value={navlink.path}
                            key={navlink.link}
                            href={navlink.path}
                            className="navLinksItems"
                        >{navlink.link}</Link>)
                    }
                    {/* --------DropDown Search Bar-------- */}
                    <div className="dropSearch" style={{ flexFlow: 'row nowrap' }}>
                        <input onChange={(e) => setSearchValue(e.target.value)} type="search" value={searchValue} id="search" placeholder="Search" />
                        <FontAwesomeIcon style={{ cursor: 'pointer', margin: '0 15px' }} onClick={handleSearch} icon={faMagnifyingGlass} />
                    </div>
                    <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* --------DropDown Cart-------- */}
                        <div onClick={() => router.push('/cart')} className="dropCart">
                            <div className="count">{cartData.length}</div>
                            <FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={faCartShopping} />
                        </div>
                        {/* --------DropDown User-------- */}
                        <div className="dropUser">
                            {loggedUser ? (<>
                                <img onClick={handleExtend} loading="lazy" src="/avatar2.webp" alt="Temp" width={40} />
                                &nbsp;
                                <h4>{loggedUser ? loggedUser.Name : 'Guest'}</h4>
                            </>) :
                                <p style={{ cursor: 'pointer', margin: '10px 0' }}><Link href={'/login'}>Login</Link></p>
                            }
                        </div>
                    </div>
                    {loggedUser ? (
                        <div className="userDropMenu">
                            <ul>
                                <li>
                                    <FontAwesomeIcon icon={faUser} /><Link href={'/profile'}>My profile</Link>
                                </li>
                                <li onClick={handleLogout}>
                                    <FontAwesomeIcon style={{ transform: 'rotate(180deg)' }} icon={faRightToBracket} /><p>Logout</p>
                                </li>
                            </ul>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}

