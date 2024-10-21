"use client"

export default function Socials() {
    return (
        <>
            <div className="socialCont">
                <h1>Get Social with Us</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, adipisci molestias perferendis odit </p>
                <div style={{ marginTop: '80px' }} className="iconsCont">
                    <img onClick={() => window.open('https://twitter.com/')} title="Twitter" loading="lazy" src="/icons/twitter.webp" alt="Twitter" />
                    <img onClick={() => window.open('https://www.instagram.com/')} title="Instagram" loading="lazy" src="/icons/instagram.webp" alt="Instagram" />
                    <img onClick={() => window.open('https://www.tiktok.com/en/')} title="TikTok" loading="lazy" src="/icons/tiktok.webp" alt="TikTok" />
                    <img onClick={() => window.open('https://www.facebook.com/')} title="Facebook" loading="lazy" src="/icons/facebook.webp" alt="Facebook" />
                </div>
            </div>
        </>
    )
}