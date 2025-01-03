'use client'
import Link from "next/link";
import { useEffect } from "react";

export default function Disclaimer() {
    useEffect(()=>{
        document.title='Disclaimer | PurEssence'
    },[])
    return (
        <>
            <div className="legalCont">
                    <h1>Disclaimer</h1>
                    <br /><hr /><br />
                    <p><strong>Last Updated: 05th October 2024</strong></p>
                    <p>
                        Welcome to PurEssence. By using this website, you agree to the terms and conditions outlined in this disclaimer. Please read the following information carefully as it governs your use of our site and products.
                    </p>

                    <h2>General Information</h2>
                    <p>
                        The content provided on this website is for general informational purposes only. While we strive to ensure that product descriptions, prices, and availability are accurate, we do not guarantee the completeness, reliability, or timeliness of any information on the site. Pure Essence reserves the right to modify product details and prices without prior notice.
                    </p>

                    <h2>Health and Wellness Disclaimer</h2>
                    <p>
                        Any health or wellness-related products sold on this website are not intended to diagnose, treat, cure, or prevent any medical condition. The information provided is not a substitute for professional medical advice. Always consult with a healthcare provider before using any health or wellness products. Use of these products is at the customer’s own risk, and Pure Essence makes no claims beyond those stated on the product labels.
                    </p>

                    <h2>Third-Party Links</h2>
                    <p>
                        Our website may contain links to third-party websites for your convenience. These links are provided as a resource, and Pure Essence does not endorse, control, or assume responsibility for the content or privacy practices of these external websites. Use of third-party sites is done at your own risk.
                    </p>

                    <h2>Product Use Disclaimer</h2>
                    <p>
                        Customers are required to follow the usage instructions provided with each product. Pure Essence is not responsible for any adverse effects or damages that result from improper use or application of products. Always read the instructions carefully before using any product purchased from our site.
                    </p>

                    <h2>Limitation of Liability</h2>
                    <p>
                        Pure Essence shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or products. This includes, but is not limited to, damages caused by reliance on any information provided on the site, or inability to use the site or products.
                    </p>

                    <h2>Errors and Omissions</h2>
                    <p>
                        Despite our best efforts, there may occasionally be errors or omissions in product descriptions, pricing, availability, or other content on the site. Pure Essence reserves the right to correct such errors without prior notice. If a pricing error occurs, we will contact you before processing your order to confirm or cancel the purchase.
                    </p>

                    <h2>Contact Information</h2>
                    <p>
                        If you have any questions regarding this disclaimer, feel free to reach out to us at <a href="mailto:info@puressenceltd.co.uk">info@puressenceltd.co.uk</a>. For more information, please review our <Link href="/legal/terms-conditions">Terms and Conditions</Link>, <Link href="/legal/privacy-policy">Privacy Policy</Link> and <Link href="/legal/shipping-returns-policy">Shipping & Returns</Link> page.
                        For further information please visit our <Link href="/contact">contact page</Link>.
                    </p>
                <div>
                    <h2>Other Legal Pages</h2>
                    <p>
                        View all of our <Link href="/legal">Legal Pages</Link>.
                    </p>
                </div>

            </div>
        </>
    )
}