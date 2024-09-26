"use client"

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faUser, faCircleQuestion, faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDataContext } from "@/context";

export default function Navbar() {
    const pathName = usePathname();
    const router = useRouter()
    const { innerWidth, setInnerWidth, cartData, loggedUser } = useDataContext()
    const [inputEle, setInputEle] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [domLoaded, setDomLoaded] = useState(false)
    const navLinks = [
        { link: 'Home', path: '/' },
        { link: 'Products', path: '/products' },
        { link: 'About', path: '/about' },
        { link: 'Guides', path: '/guides' },
        { link: 'FAQs', path: '/FAQs' },
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

    // const handleLogout = () => {
    //     fetch('/api/user?action=logout', {
    //         method: 'POST',
    //         credentials: "include"
    //     })
    //         .then(res => {
    //             // if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
    //             //     return res.json();
    //             // }
    //             // return { message: 'Logout successful' }; // Fallback if no content
    //             // return res.json()
    //         })
    //         .then(result => console.log(result))
    //         .catch(err => console.log(err));
    // }
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
            if (isCalled && !userMenu.contains(event.target) && !btn.contains(event.target)) {
                userMenu.classList.remove('active')
                isCalled = false
            }
            if (isDropped && !userMenu.contains(event.target) && !menuBtn.contains(event.target) && !serchBar.contains(event.target)) {
                droplinks.classList.remove('drop')
                console.log(droplinks)
                isDropped = false
            }
        })
    }

    useEffect(() => {
        setDomLoaded(true)
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
        if (innerWidth >= 1000 && menuBtn && menuBtn.classList.contains('open')) {
            menuBtn.classList.remove('open');
            droplinks.classList.remove('drop');
        };

        docBody.addEventListener('click', handleClose);
        return () => {
            docBody.removeEventListener('click', handleClose);
            window.removeEventListener("resize", handleWindow);
        };

    }, [searchValue, innerWidth])

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
    }, [pathName])
    return (
        <>
            <div className="navMainCont">
                {/* --------Nav Container-------- */}
                <div className="navContainer">
                    {/*------Company Logo------*/}
                    <div className="navLogo"><Link href={'/'}>Pure Essence</Link></div>
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
                        <div className="searchBar">
                            <input onChange={(e) => setSearchValue(e.target.value)} type="search" value={searchValue} id="search" />
                            <FontAwesomeIcon className="searchIcon" onClick={handleSearch} icon={faMagnifyingGlass} />
                        </div>
                        {/* -------Cart--------- */}
                        <div onClick={() => router.push('/cart')} className="cartCont">
                            <div className="count">{cartData.length}</div>
                            <FontAwesomeIcon style={{ fontSize: '1.5rem', paddingTop: '7px' }} icon={faCartShopping} />
                        </div>
                        {/* -------Active User------- */}
                        <div onClick={handleUserDrop} className="userCont">
                            <img src="/avatar2.webp" alt="Temp" width={40} />
                            <div className="userMenu">
                                {loggedUser ? (<>
                                    <h3>{loggedUser.Name}</h3>
                                    <ul>
                                        <li>
                                            <FontAwesomeIcon icon={faUser} /><a href="#">My profile</a>
                                        </li>
                                        <li><FontAwesomeIcon icon={faCircleQuestion} /><a href="#">Help</a></li>
                                        <li>
                                            <FontAwesomeIcon icon={faCircleArrowLeft} /><a href="#">Logout</a>
                                        </li>
                                    </ul>
                                </>) : (<>
                                    <h3>Guest</h3>
                                    <ul>
                                        <li>
                                            <FontAwesomeIcon icon={faUser} /><Link href="#">Login</Link>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon icon={faUser} /><a href="#">Signup</a>
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
                    <div className="dropSearch" style={{ display: 'flex', flexFlow: 'row nowrap' }}>
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
                        <div className="dropUser" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/avatar2.webp" alt="Temp" width={40} />
                            <h4>{loggedUser ? loggedUser.Name : 'Haji Robert'}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

