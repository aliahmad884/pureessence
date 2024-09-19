"use client"

import { faEnvelope, faHouse, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IonIcon } from "@ionic/react";
import Link from "next/link";
import { logoFacebook, logoLinkedin, logoTwitter, logoYoutube } from "ionicons/icons"

export default function Footer() {
    const navLinks = [
        { link: 'Home', path: '/' },
        { link: 'Products', path: '/products' },
        { link: 'About', path: '/about' },
        { link: 'Guides', path: '/guides' },
        { link: 'FAQs', path: '/FAQs' },
        { link: 'Blogs', path: '/blogs' }
    ];
    return (
        <>
            <div className="footer">
                <div className="logo">
                    <img src="/CircleLogo.webp" alt="Logo" width={50} />
                    <div>
                        <h1><strong style={{ color: '#dfb434' }}>Pure</strong> Essence</h1>
                        <p>Lorem Ipsum</p>
                    </div>
                </div>
                <div className="mainCont">
                    <div className="explore">
                        <h2>Explore Site</h2>
                        {
                            navLinks.map(navlink => <Link
                                data-value={navlink.path}
                                key={navlink.link}
                                href={navlink.path}
                                className="navLinks"
                            >{navlink.link}</Link>)
                        }
                    </div>
                    <div className="bestSeller">
                        <h2>Best Sellers</h2>
                        <a href="#">Spice</a>
                        <a href="#">Hurb</a>
                        <a href="#">Honey</a>
                        <a href="#">Lorem</a>
                    </div>
                    <div className="legal">
                        <h2>Legal &amp; Info</h2>
                        <a href="#">Terms &amp; Conditions</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Refunds Policy</a>
                        <a href="#">Delivery</a>
                        <a href="#">Sitemap</a>
                    </div>
                    <div className="address">
                        <h2><strong style={{ color: '#dfb434' }}><FontAwesomeIcon icon={faHouse} /></strong> Mailing Address</h2>
                        <address>Pure Essence Office, Purest Road, Blackburn, Lancashire, BB1 PYR, UK</address>
                    </div>
                </div>
            </div>
            <div className="copy">
                <p>Copyright &copy; 2024 Pure Essence LTD - All Rights Reserved</p>
            </div>
        </>
    )
}