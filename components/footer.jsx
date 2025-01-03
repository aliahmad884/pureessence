"use client"

import Link from "next/link";
import Image from "next/image";

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
                <div className="footerSubCont">
                    <div className="logo">
                        <img loading="lazy" src="/logos/PE-Small-Text-Logo-Large.png" alt="Logo" /><br />
                        <p><b>&quot;The Purest Products,<br /> For a Better You&quot;</b></p>
                    </div>
                    <div className="mainCont">
                        <div className="explore">
                            <h2>Explore Site</h2>
                            {
                                navLinks.map(navlink => <Link
                                    data-value={navlink.path}
                                    key={navlink.link}
                                    href={navlink.path}
                                    className="navLinksItems"
                                >{navlink.link}</Link>)
                            }
                        </div>
                        <div className="bestSeller">
                            <h2>Popular</h2>
                            <Link href="/products">Honey</Link>
                            <Link href="/products">Vinegar</Link>
                            <Link href="/products">Concentrate</Link>
                            <Link href="/products">Syrup</Link>
                        </div>
                        <div className="legal">
                            <h2><Link href={'/legal'}>Legal &amp; Info</Link></h2>
                            <Link className="navLinksItems" data-value={'/legal/terms-conditions'} href={'/legal/terms-conditions'}>Terms &amp; Conditions</Link>
                            <Link className="navLinksItems" data-value={'/legal/privacy-policy'} href={'/legal/privacy-policy'}>Privacy Policy</Link>
                            <Link className="navLinksItems" data-value={'/legal/disclaimer'} href={'/legal/disclaimer'}>Disclaimer</Link>
                            <Link className="navLinksItems" data-value={'/legal/shipping-returns-policy'} href={'/legal/shipping-returns-policy'}>Shipping &amp; Returns</Link>
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
            </div>
            <div className="copy">
                <div className="payCards">
                    <Image src="/iconImgs/applePay.webp" alt="Apple Pay" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} />
                    <Image src="/iconImgs/masterCard.webp" alt="Master Card" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} />
                    <Image src="/iconImgs/visaCard.webp" alt="Visa" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} />
                </div>
                <p>Copyright &copy; {new Date().getFullYear()} <Link href={'/'}>PurEssence LTD </Link>- All Rights Reserved | Designed and Developed by <Link style={{ textDecoration: 'underline' }} href={'https://aldortech.com'}>AldorTech</Link>
                </p>
            </div>
        </>
    )
}
