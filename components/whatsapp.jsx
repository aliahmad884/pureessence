"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const WHATSAPP_URL = "https://wa.me/+4401254411076";

function WhatsAppIcon({ className = "" }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
    )
}

export default function Whatsapp() {
    const [showTop, setShowTop] = useState(false)

    const returnToTop = () => {
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
    }

    useEffect(() => {
        const handleScroll = () => {
            const y = document.documentElement.scrollTop
            setShowTop((prev) => (y > 350 ? true : y < 300 ? false : prev))
        }
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-center gap-3 sm:right-6">
            {/* Back to top */}
            <button
                type="button"
                onClick={returnToTop}
                aria-label="Back to top"
                aria-hidden={!showTop}
                tabIndex={showTop ? 0 : -1}
                className={
                    "grid h-11 w-11 place-items-center rounded-full border border-[#e6b02f]/40 bg-[#1e1e1e]/90 text-[#e6b02f] " +
                    "shadow-lg shadow-black/40 backdrop-blur transition duration-300 motion-reduce:transition-none " +
                    "hover:bg-[#e6b02f] hover:text-[#181818] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b02f] " +
                    (showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0")
                }
            >
                <ArrowUp size={20} strokeWidth={2.25} aria-hidden="true" />
            </button>

            {/* WhatsApp */}
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="group relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#2be276] to-[#1ebe5a] text-white shadow-lg shadow-[#25D366]/30 ring-1 ring-white/25 transition duration-300 motion-reduce:transition-none hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
            >
                <WhatsAppIcon className="h-7 w-7" />

                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-full mr-3 hidden translate-x-1 whitespace-nowrap rounded-full border border-white/10 bg-[#1e1e1e] px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg shadow-black/40 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block"
                >
                    Chat with us
                </span>
            </a>
        </div>
    )
}
