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
        { link: 'Contact', path: '/contact' },
        { link: 'Blogs', path: '/blogs' }
    ];
    return (
        <>
            <div className="footer">
                <div className="logo">
                    {/* <img src="/transLogo.png" alt="Logo" width={50} /> */}
                    <img src="/logos/PE-Main-Logo.png" alt="Logo" />
                    {/* <img src="/logos/PE-Small-Text-Logo.png" alt="Logo"  /> */}
                    {/* <div>
                        <h1><strong style={{ color: '#dfb434' }}>Pur</strong> Essence</h1>
                        <p>The Purest Products, For a Better You.</p>
                    </div> */}
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
                        <h2>Popular</h2>
                        <a href="#">Honey</a>
                        <a href="#">Vinegar</a>
                        <a href="#">Concentrate</a>
                        <a href="#">Syrup</a>
                    </div>
                    <div className="legal">
                    <h2><Link href={'/legal'}>Legal</Link> &amp; Info</h2>
                        <Link href={'/legal/terms-conditions'}>Terms &amp; Conditions</Link>
                        <Link href={'/legal/privacy-policy'}>Privacy Policy</Link>
                        <Link href={'/legal/disclaimer'}>Disclaimer</Link>
                        <Link href={'/legal/shipping-returns-policy'}>Shipping &amp; Returns</Link>
                        <Link href={'/sitemap.xml'}>Sitemap</Link>

                    </div>
                    <div className="address">
                        <h2>
                            {/* <strong style={{ color: '#dfb434' }}><FontAwesomeIcon icon={faHouse} /></strong>  */}
                            Address</h2>
                        <address>Kings Court 33 King Street, Blackburn, UK, BB2 2DH</address>
                    </div>
                </div>
            </div>
            <div className="copy">
                <p>Copyright &copy; {Date().slice(11, 15)} <Link href={'/'}>Pure Essence LTD </Link>- All Rights Reserved | Designed and Developed by <Link href={'https://aldortech.com'}>AldorTech</Link>
                </p>
            </div>
        </>
    )
}