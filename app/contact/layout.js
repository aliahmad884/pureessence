import Head from 'next/head';

export const metadata = {
    title: 'Contact | PurEssence | The Purest Products, For a Better You',
    description: "Get in touch with PurEssence Ltd for inquiries, support, or feedback. Contact us today to learn more about our natural health products."
};

const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact - PurEssence Ltd",
    "url": "https://test.puressenceltd.co.uk/contact",
    "description": "Reach out to PurEssence Ltd for support and inquiries.",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+44-123-456-7890",
        "email": "info@test.puressenceltd.co.uk",
        "contactType": "Customer Service"
    }
};

export default function ContactLayout({ children }) {
    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                />
            </Head>
            {children}
        </>
    );
}
