"use client";


import { IonIcon } from "@ionic/react";
import { arrowUpCircleOutline, logoWhatsapp } from "ionicons/icons";
import { usePathname } from "next/navigation";
import { useEffect } from "react";


export default function Whatsapp() {
    const pathName = usePathname()


    const handleWhats = () => {
        window.open('https://wa.me/+4401254411076')
    }

    const returnToTop = () => {
        let scrollBody = document.documentElement;
        if (scrollBody) {
            scrollBody.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        const handleArrow = () => {
            let btn = document.getElementById('arrowBtn');
            let scrollBody = document.documentElement;
            if (scrollBody && btn) {
                if (scrollBody.scrollTop > 350) {
                    btn.style.display = 'block'
                } else if (scrollBody.scrollTop < 300) {
                    btn.removeAttribute('style')
                }
            }
        }
        window.addEventListener('scroll', handleArrow)
        return () => window.removeEventListener('scroll', handleArrow)
    }, [pathName])
    return (
        <>
            <div className="quikIconCont">
                <div onClick={() => handleWhats()} className="whatsCont">
                    <IonIcon className="whatsapp" icon={logoWhatsapp} />
                </div>
                <div id="arrowBtn" onClick={() => returnToTop()} className="upCont">
                    <IonIcon className="arrowUp" icon={arrowUpCircleOutline} />
                </div>
            </div>
        </>
    )
}