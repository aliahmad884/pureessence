"use client"

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDataContext } from "@/context";

export default function Navbar() {
    const pathName = usePathname();
    const { innerWidth, setInnerWidth } = useDataContext()
    const [barBtn, setBarBtn] = useState('');
    const [inputEle, setInputEle] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [dropRouteLinks, setDropRouteLinks] = useState('');
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
    const handleMenu = (event) => {
        event.stopPropagation();
        barBtn.classList.toggle('open')
        dropRouteLinks.classList.toggle('drop')
    }
    const onTapClose = () => {
        barBtn.classList.remove('open')
        dropRouteLinks.classList.remove('drop')
    }


    useEffect(() => {
        let droplinks = document.querySelector('.routerDropDown');
        let menuBtn = document.getElementById('barBtn');
        let input = document.getElementById('search');
        let docBody = document.documentElement;
        setDropRouteLinks(droplinks);
        setInputEle(input);
        setBarBtn(menuBtn);

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
        console.log(pathName)
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
                        <div className="cartCont">
                            <div className="count">7</div>
                            <FontAwesomeIcon style={{ fontSize: '1.5rem', paddingTop: '7px' }} icon={faCartShopping} />
                        </div>
                        {/* -------Active User------- */}
                        <div className="userCont">
                            <img src="/avatar2.webp" alt="Temp" width={40} />
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
                            onClick={onTapClose}
                        >{navlink.link}</Link>)
                    }
                    {/* --------DropDown Search Bar-------- */}
                    <div className="dropSearch" style={{ display: 'flex', flexFlow: 'row nowrap' }}>
                        <input onChange={(e) => setSearchValue(e.target.value)} type="search" value={searchValue} id="search" />
                        <FontAwesomeIcon style={{ cursor: 'pointer', margin: '0 15px' }} onClick={handleSearch} icon={faMagnifyingGlass} />
                    </div>
                    <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* --------DropDown Search Cart-------- */}
                        <div className="dropCart">
                            <div className="count">7</div>
                            <FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={faCartShopping} />
                        </div>
                        {/* --------DropDown Search User-------- */}
                        <div className="dropUser" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/avatar2.webp" alt="Temp" width={40} />
                            <h4>Haji Robert</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

