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
        { link: 'Guides', path: '/blogs/health-guides' },
        { link: 'Contact', path: '/contact' },
        { link: 'Blogs', path: '/blogs' },
        { link: 'FAQs', path: '/frequently-asked-questions' }
    ];
    return (
        <>
            <div className="footer">
                <div className="logo">
                    {/* <img loading="lazy"  src="/transLogo.png" alt="Logo" width={50} /> */}
                    <ol>
                        <img loading="lazy" src="/logos/PE-Small-Text-Logo-Large.png" alt="Logo" /><br />
                        <img loading="lazy" src="/logos/PE-Small-Text-Logo-Large.png" alt="Logo" /><br />
                        <p><b>&quot;The Purest Products,<br /> For a Better You&quot;</b></p>
                    </ol>
                    {/* <img loading="lazy"  src="/logos/PE-Main-Logo.png" alt="Logo"  /> */}
                    {/* <div>
                        <h1><strong style={{ color: '#dfb434' }}>Pur</strong> Essence</h1>
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
                        <a href="/products">Honey</a>
                        <a href="/products">Vinegar</a>
                        <a href="/products">Concentrate</a>
                        <a href="/products">Syrup</a>
                    </div>
                    <div className="legal">
                        <h2><Link href={'/legal'}>Legal &amp; Info</Link></h2>
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
                        <h2>
                            {/* <strong style={{ color: '#dfb434' }}><FontAwesomeIcon icon={faHouse} /></strong>  */}
                            Company Details</h2>
                        <p>PURESSENCE LTD</p>
                        <p>Company Number: 15766653</p>
                    </div>
                </div>
            </div>
            <div className="copy">
                <div className="payCards">
                    <img src="/icons/applePay.webp" alt="Apple Pay" loading="lazy" />
                    <img src="/icons/masterCard.webp" alt="Master Card" loading="lazy" />
                    <img src="/icons/visaCard.webp" alt="Visa" loading="lazy" />
                </div>
                <p>Copyright &copy; {new Date().getFullYear()} <Link href={'/'}>PurEssence LTD </Link>- All Rights Reserved | Designed and Developed by <Link style={{ textDecoration: 'underline' }} href={'https://aldortech.com'}>AldorTech</Link>
                </p>
            </div>
        </>
    )
}
