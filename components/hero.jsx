"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { CustomeToast } from "./checkoutForm"
import toast, { Toaster } from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"

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
                <h1>The Purest<br /> Products, For a<br /> Better You.</h1>
                <button type="button">Shop Now</button>
                {show && createPortal(<CustomeToast onClick={() => setShow(!show)} />, document.body)}
            </div>
            <div className="aboutContainer">
                <div className="aboutText">
                    <h1>About the Brand</h1>
                    <p>There is nothing like fresh spice or the purest of ingredients for your daily diet or supplimentary intake</p>
                    <br />
                    <p>This is why the team behind Pure Essence recognised the need for international supplies of the highest quality of natural products.</p>
                    <br />
                    <p>The team come from a background of herbal practitioners and good ol&apos; spice lovers, so rest assured Pure Essence provides the best quality and type of product for a better you.</p>
                </div>
                <div className="aboutImg">
                    <img src="/spices.webp" alt="Spices" />
                </div>
            </div>
            <div className="offerContainer">
                <h1>What We Offer</h1>
                <div className="imgCont">
                    <div className="cardCont">
                        <img src="/spices.webp" alt="Spices" />
                        <h2>Rich Spices</h2>
                        <p>Who said you can&apos;t eat till you are fit. Food is a pillar of health, you either keep it or ruin it.</p>
                    </div>
                    <div className="cardCont">
                        <img src="/spices.webp" alt="Spices" />
                        <h2>Fresh Suppliments</h2>
                        <p>Improve your health or recover from ailment, we source only the most natural products.</p>
                    </div>
                    <div className="cardCont">
                        <img src="/spices.webp" alt="Spices" />
                        <h2>Quality Health Foods</h2>
                        <p>Who said you can&apos;t eat till you are fit. Food is a pillar of health, you either keep it or ruin it.</p>
                    </div>
                    <div className="cardCont">
                        <img src="/spices.webp" alt="Spices" />
                        <h2>Fresh Suppliments</h2>
                        <p>Improve your health or recover from ailment, we source only the most natural products.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
