"use client"

import Image from "next/image"
import Link from "next/link"

export default function Socials() {
    return (
        <>
            <div className="socialCont">
                <h1>Get Social with Us</h1>
                <p>Stay connected and be part of our vibrant community. Share, engage, and discover endless opportunities to connect with like-minded individuals.</p>
                <div style={{ marginTop: '80px' }} className="iconsCont">
                    <Link href={'https://www.instagram.com/pure_ssenceltd'}><Image src="/iconImgs/twitter.webp" alt="Twitter" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} /></Link>
                    <Link href={'https://www.instagram.com/pure_ssenceltd'}><Image src="/iconImgs/instagram.webp" alt="Instagram" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} /></Link>
                    <Link href={'https://www.tiktok.com/@puressenceltd1'}><Image src="/iconImgs/tiktok.webp" alt="Tiktok" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} /></Link>
                    <Link href={'https://www.instagram.com/pure_ssenceltd'}><Image src="/iconImgs/facebook.webp" alt="Facebook" sizes="100vw" style={{ width: '40px', height: '100%' }} height={0} width={0} /></Link>
                </div>
            </div>
        </>
    )
}
