"use client"

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faUser, faCircleQuestion, faCircleArrowLeft, faRightToBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
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
        { link: 'Guides', path: '/guides' },
        { link: 'Contact', path: '/contact' },
        { link: 'Blogs', path: '/blogs' }
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
                // SetDOMLoaded(false)
                setTimeout(() => {
                    // SetDOMLoaded(false)
                    window.location.reload()
                }, 1500)

            }
            return res.json()
        }).then(result => {
            console.log(result)
            // toast.success("Logout successfully!", toastOptions.success)
        }).catch(err => console.log(err));
    }
    let isCalled = false;
    const handleUserDrop = (event) => {
        event.stopPropagation()
        let userMenu = document.querySelector('.userMenu')
        userMenu.classList.toggle('active')
        isCalled = true;
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
        console.log('Navbar hook rendered')
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
        let navLinks = document.querySelectorAll('.navLinks')
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
                        <img src="/logos/PE-Main-Logo.png" alt="Logo"  width={200}/>
                        {/* <img src="/logos/PE-Small-Text-Logo.png" alt="Logo"  />  */}
                        {/* <img src="/logos/PE-Main-Logo-Large.png" alt="Logo"  /> */}
                        {/* <div>
                            <h1><strong style={{ color: '#dfb434' }}>Pur</strong> Essence</h1>
                            <p>The Purest Products, For a Better You.</p>
                        </div> */}
                    </div>
                    <div className="navMenu">
                        {/*-----Routes Link------*/}
                        <div className="navLinks">
                            {
                                navLinks.map(navlink => <Link
                                    data-value={navlink.path}
                                    key={navlink.link}
                                    href={navlink.path}
                                    className="navLinks"
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
                        <div style={{ display: 'none' }} className="searchBar">
                            <input onChange={(e) => setSearchValue(e.target.value)} type="search" value={searchValue} id="search" />
                            <FontAwesomeIcon className="searchIcon" onClick={handleSearch} icon={faMagnifyingGlass} />
                        </div>
                        {/* -------Cart--------- */}
                        <div onClick={() => router.push('/cart')} className="cartCont">
                            <div className="count">{cartData.length}</div>
                            <FontAwesomeIcon style={{ fontSize: '1.5rem', paddingTop: '7px' }} icon={faCartShopping} />
                        </div>
                        {/* -------Active User------- */}
                        <div style={{ display: 'none' }} onClick={handleUserDrop} className="userCont">
                            <img src="/avatar2.webp" alt="Temp" width={40} />
                            <div className="userMenu">
                                {loggedUser ? (<>
                                    <h3>{loggedUser.Name}</h3>
                                    <ul>
                                        <li>
                                            <FontAwesomeIcon icon={faUser} /><Link href={'/profile'}>My profile</Link>
                                        </li>
                                        <li><FontAwesomeIcon icon={faCircleQuestion} /><a href="#">Help</a></li>
                                        <li onClick={handleLogout}>
                                            <FontAwesomeIcon style={{ transform: 'rotate(180deg)' }} icon={faRightToBracket} /><p>Logout</p>
                                        </li>
                                    </ul>
                                </>) : (<>
                                    <h3>Guest</h3>
                                    <ul>
                                        <li>
                                            <FontAwesomeIcon icon={faRightToBracket} /><Link href={`/login?retTo=${pathName}`}>Login</Link>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faUserPlus} /><Link href={"/signup"}>Signup</Link>
                                        </li>
                                    </ul>
                                </>)}
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
                            className="navLinks"
                        >{navlink.link}</Link>)
                    }
                    {/* --------DropDown Search Bar-------- */}
                    <div className="dropSearch" style={{ display: 'none', flexFlow: 'row nowrap' }}>
                        <input onChange={(e) => setSearchValue(e.target.value)} type="search" value={searchValue} id="search" />
                        <FontAwesomeIcon style={{ cursor: 'pointer', margin: '0 15px' }} onClick={handleSearch} icon={faMagnifyingGlass} />
                    </div>
                    <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* --------DropDown Search Cart-------- */}
                        <div onClick={() => router.push('/cart')} className="dropCart">
                            <div className="count">{cartData.length}</div>
                            <FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={faCartShopping} />
                        </div>
                        {/* --------DropDown Search User-------- */}
                        <div onClick={handleExtend} className="dropUser" style={{ display: 'none', alignItems: 'center' }}>
                            <img src="/avatar2.webp" alt="Temp" width={40} />
                            <h4>{loggedUser ? loggedUser.Name : 'Guest'}</h4>
                        </div>
                    </div>
                    <div style={{ display: 'none' }} className="userDropMenu">
                        {loggedUser ? (<>
                            <ul>
                                <li>
                                    <FontAwesomeIcon icon={faUser} /><Link href={'/profile'}>My profile</Link>
                                </li>
                                <li onClick={handleLogout}>
                                    <FontAwesomeIcon style={{ transform: 'rotate(180deg)' }} icon={faRightToBracket} /><p>Logout</p>
                                </li>
                            </ul>
                        </>) : (<>
                            <ul>
                                <li>
                                    <FontAwesomeIcon icon={faRightToBracket} /><Link href={`/login?retTo=${pathName}`}>Login</Link>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faUserPlus} /><Link href={'/signup'}>Signup</Link>
                                </li>
                            </ul>
                        </>)}
                    </div>
                </div>
            </div>
        </>
    )
}

