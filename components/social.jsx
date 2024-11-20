"use client"

import Image from "next/image"

export default function Socials() {
    return (
        <>
            <div className="socialCont">
                <h1>Get Social with Us</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, adipisci molestias perferendis odit </p>
                <div style={{ marginTop: '80px' }} className="iconsCont">
                    <Image onClick={() => window.open('https://twitter.com/')} src="/iconImgs/twitter.webp" alt="Apple Pay" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} />
                    <Image onClick={() => window.open('https://www.instagram.com/')} src="/iconImgs/instagram.webp" alt="Master Card" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} />
                    <Image onClick={() => window.open('https://www.tiktok.com/en/')} src="/iconImgs/tiktok.webp" alt="Visa" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} />
                    <Image onClick={() => window.open('https://www.facebook.com/')} src="/iconImgs/facebook.webp" alt="Apple Pay" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} />
                </div>
            </div>
        </>
    )
}