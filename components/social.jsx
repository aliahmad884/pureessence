"use client"

import Image from "next/image"
import Link from "next/link"

export default function Socials() {
    return (
        <>
            <div className="socialCont">
                <h1>Get Social with Us</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, adipisci molestias perferendis odit </p>
                <div style={{ marginTop: '80px' }} className="iconsCont">
                    <Link href={'#'}><Image src="/iconImgs/twitter.webp" alt="Twitter" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} /></Link>
                    <Link href={'#'}><Image src="/iconImgs/instagram.webp" alt="Instagram" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} /></Link>
                    <Link href={'#'}><Image src="/iconImgs/tiktok.webp" alt="Tiktok" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} /></Link>
                    <Link href={'#'}><Image src="/iconImgs/facebook.webp" alt="Facebook" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} /></Link>
                </div>
            </div>
        </>
    )
}