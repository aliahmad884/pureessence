import Head from 'next/head';

export const metadata = {
    title: 'About | PurEssence | The Purest Products, For a Better You',
    description: "Learn more about PurEssence Ltd, a trusted provider of natural health products. Our About page shares our mission, vision, and commitment to delivering the purest products for a healthier life."
};

const schemaData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About PurEssence Ltd",
    "url": "https://test.puressenceltd.co.uk/about",
    "description": "Learn about PurEssence Ltd, our commitment to providing the purest natural health products.",
    "publisher": {
        "@type": "Organization",
        "name": "PurEssence Ltd",
        "logo": {
            "@type": "ImageObject",
            "url": "https://test.puressenceltd.co.uk/CircleLogo.webp"
        }
    }
};

export default function AboutLayout({ children }) {
    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                {/* Schema as JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                />
            </Head>
            {children}
        </>
    );
}
