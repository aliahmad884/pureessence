"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { CustomeToast } from "./checkoutForm"
import toast, { Toaster } from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

export default function Hero() {
    const [show, setShow] = useState(false)
    // const showToast = () => {
    //     toast.success('Test Toast',{
    //         icon:<FontAwesomeIcon style={{color:'cadetblue',fontSize:'1.5rem'}} icon={faInfoCircle}/>
    //     })
    //     // toast.loading('wait....')

    //     toast.promise()
    //     // setShow(!show)
    // }
    return (
        <>
            <Toaster />
            <div className="heroContainer">
                <h1>&quot;The Purest<br /> Products, For a<br /> Better You&quot;</h1>
                {/* PLEASE ADD FOLLOWING WITH BOLD AND WHITE TEXT: <p>We offer quality-sourced health products and foods, with international delivery.</p> */}
                <p>We offer quality-sourced health foods and products,<br/> with international delivery.</p>
                {/* <button type="button">Shop Now</button> */}
                <Link href={'/products'}>Shop Now</Link>
                {show && createPortal(<CustomeToast onClick={() => setShow(!show)} />, document.body)}
            </div>
            <div className="aboutContainer">
                <div className="aboutText">
                    <h1>About the Brand</h1>
                    <p>Feeling tired? Or just wanting that raw power you know is in your potential. Or maybe you want to preserve that precious health that you have?</p>
                    <br />
                    <p>All of these reasons is why PurEssence launched an online store to serve health products and foods.</p>
                    <br />
                    <p>The PurEssence team come from a background of herbal practitioners and philanthropists, sharing knowledge, guidance and solutions.</p>
                    <br />
                    <p>You can read more about us on our <a href="/about"><b>About page.</b></a></p>
                </div>
                <div className="aboutImg">
                    <img loading="lazy"  src="/PE-Olive-Oil-4.webp" alt="Spices" />
                </div>
            </div>
            <div className="offerContainer">
                <h1>What We Offer</h1>
                <div className="imgCont">
                    <div className="cardCont">
                        <div style={{ backgroundImage: "url(/PE-Olive-Oil-5.webp)" }} className="img"></div>
                        <h2>Health Foods, Also Known as Superfoods</h2>
                        <p>Who said you can&apos;t eat till you are fit. Food is a pillar of health, you either keep it or ruin it.</p>
                    </div>
                    <div className="cardCont">
                        <div style={{ backgroundImage: "url(/PE-Honey-P5.webp)" }} className="img"></div>
                        <h2>Purest Suppliments</h2>
                        <p>Improve your health or recover from ailment, we source only the most natural products.</p>
                    </div>
                    <div className="cardCont">
                        <div style={{ backgroundImage: "url(/PE-Almond-Oil.webp)" }} className="img"></div>
                        <h2>Health Guides</h2>
                        <p>Health guides backed by science <i>and</i> traditional (non-pharma) medicine.</p>
                    </div>
                    <div className="cardCont">
                        <div style={{ backgroundImage: "url(/Pure-Essence-Support.jpg)" }} className="img"></div>
                        <h2>Personal Support</h2>
                        <p>We lend you two ears when you need, for advice based on our guides or the products we offer.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
