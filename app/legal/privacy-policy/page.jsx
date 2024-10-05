import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <>
            <div className="legalCont">
                <h1>Privacy Policy</h1>

                <p><strong>Last Updated: 24th September 2024</strong></p>
                <div>
                    <h2>Introduction</h2>
                    <p>
                        We are committed to protecting your privacy. This policy outlines how we collect, use, and protect your personal data when using our services. We comply with applicable privacy laws, including the UK Data Protection Act and the GDPR, ensuring your rights are respected. Please note, users under 18 may access our services only with parental supervision, and users under 13 are not allowed to use our website.
                    </p>
                </div>

                <div>
                    <h2>Information We Collect</h2>
                    <p>
                        We collect both personal and non-personal information from you. Personal information includes data such as your name, email address, billing information, and any other details required for providing our services. Non-personal information may include your IP address, browser type, and other anonymized data. We also use cookies and tracking technologies to enhance your user experience.
                    </p>
                </div>

                <div>
                    <h2>How We Use the Information</h2>
                    <p>
                        We use your personal information to provide and improve our services, fulfill orders, communicate with you, and comply with legal obligations. Non-personal data helps us analyze user behavior and improve site performance. We may also use your information for marketing purposes, but you can opt out at any time. Additionally, your data may be used to ensure compliance with legal regulations.
                    </p>
                </div>

                <div>
                    <h2>How We Share Information</h2>
                    <p>
                        We may share your information with third-party service providers, such as payment processors, hosting services, and analytics platforms. We will also share your information when required to comply with legal obligations or with your consent.
                    </p>
                </div>

                <div>
                    <h2>Your Rights Regarding Your Data</h2>
                    <p>
                        You have the right to access, correct, and delete your personal information. You may also opt-out of receiving marketing communications and limit the use of cookies. You can request that your data be transferred to another provider, or object to certain types of data processing. If you would like to exercise any of these rights, please contact us directly.
                    </p>
                </div>
                <div>
                    <h2>How We Protect Your Information</h2>
                    <p>
                        We implement strict security measures, including encryption and access controls, to protect your data. We retain your personal information only for as long as necessary to provide our services or as required by law. In the event of a data breach, we will notify affected users promptly.
                    </p>
                </div>

                <div>
                    <h2>Children&apos;s Privacy</h2>
                    <p>
                        We do not knowingly collect data from users under the age of 13. If we discover such data has been collected, we will delete it immediately. Users under 18 are required to have parental supervision to use our services.
                    </p>
                </div>

                <div>
                    <h2>International Data Transfers</h2>
                    <p>
                        Your information may be transferred outside of the UK or the EEA for processing or storage. We ensure that appropriate safeguards, such as standard contractual clauses, are in place to protect your data during international transfers.
                    </p>
                </div>

                <div>
                    <h2>Cookies and Tracking Technologies</h2>
                    <p>
                        We use cookies to improve functionality, analyze usage, and personalize your experience. You can manage your cookie preferences through your browser settings or opt out of non-essential cookies.
                    </p>
                </div>

                <div>
                    <h2>Changes to the Privacy Policy</h2>
                    <p>
                        We may update this privacy policy from time to time. If any significant changes are made, we will notify you via email or a prominent notice on our website. We encourage you to review this policy periodically to stay informed about how we protect your information.
                    </p>
                </div>

                <div>
                    <h2>Contact Information</h2>
                    <p>
                        If you have any questions or concerns about this policy, or if you would like to exercise your data rights, please <Link href="/contact">contact us</Link>.
                    </p>
                </div>

                <div>
                    <h2>Additional Disclosures</h2>
                    <p>
                        For users in the UK, we comply with the UK Data Protection Act and GDPR. International users are advised that their data may be transferred outside their home country, and appropriate safeguards are in place. For California residents, you have additional rights under the CCPA, which can be exercised by contacting us.
                    </p>
                </div>
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