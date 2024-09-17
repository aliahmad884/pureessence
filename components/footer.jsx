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
                <div className="footerMainCont">
                    <div className="cont1">
                        <div className="logoCont">
                            <img src="/CircleLogo.webp" alt="Logo" />
                            <h3>Pure Essence LTD</h3>
                            <p>We deliver natural spices, herbs and supplements across the UK.</p>
                        </div>
                        <div className="explor">
                            <h3>Explore Site</h3>
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
                            <h3>Best Sellers</h3>
                            <ul>
                                <li>Spice</li>
                                <li>Herb</li>
                                <li>Honey</li>
                                <li>Pure Item</li>
                            </ul>
                        </div>
                        <div className="legal">
                            <h3>Legal &amp; Information</h3>
                            <ul>
                                <li>Terms &amp; Conditions</li>
                                <li>Privacy Policy</li>
                                <li>Refunds Policy</li>
                                <li>Delivery</li>
                                <li>Sitemap</li>
                            </ul>
                        </div>
                    </div>
                    <div className="cont2">
                        <div className="company">
                            <h3>Company Number</h3>
                            <p>5912359153</p>
                            <h3>Vat Number</h3>
                            <p>123412341234</p>
                        </div>
                        <div className="mailAddress">
                            <h3><FontAwesomeIcon icon={faHouse} /> Mailing Address</h3>
                            <address>
                                <p>Pure Essence Office, Purest Road, Blackburn, Lancashire, BB1 PYR, UK</p>
                            </address>
                            <h3><FontAwesomeIcon icon={faPhone} /> Phone Number</h3>
                            <p> <a href="tel:+441254411076">+44 (0) 1254 411076</a></p>
                            <h3><FontAwesomeIcon icon={faEnvelope} /> Email Address</h3>
                            <p><a href="mailto:enquires@pureessenceltd.co.uk">enquires@pureessenceltd.co.uk</a></p>
                        </div>
                        <div className="social">
                            <h3><IonIcon icon={logoTwitter} /> @pureessence</h3>
                            <h3><IonIcon icon={logoFacebook} /> @pureessence</h3>
                            <h3><IonIcon icon={logoLinkedin} /> @pureessence</h3>
                        </div>
                    </div>
                    <div className="copyRight">
                        <p>Copyright &copy; 2024 Pure Essence LTD - All Rights Reserved</p>
                    </div>
                </div>
            </div>
        </>
    )
}