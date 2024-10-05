import Link from "next/link";

export default function Terms() {
    return (
        <>
            <div className="legalCont">
                <h1>Legal Pages</h1><br />
                <p><strong>Last Updated: 24th September 2024</strong></p><br />
                <div>
                    <h2>Here are the links for our legal pages:</h2>

                </div>
                <br />
                <div>
                        <h2><Link href="/legal/terms-conditions">Terms</Link></h2><br />
                        <h2><Link href="/legal/privacy-policy">Privacy Policy</Link></h2><br />
                        <h2><Link href="/legal/shipping-returns-policy">Shipping and Returns</Link></h2><br />
                        <h2><Link href="/legal/disclaimer">Disclaimer</Link></h2><br /><br />
                </div>
            </div>
        </>
    )
}