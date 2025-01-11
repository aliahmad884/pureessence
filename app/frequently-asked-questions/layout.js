import Head from 'next/head';

export const metadata = {
    title: 'FAQs | PurEssence | The Purest Products, For a Better You',
    description: "Find answers to frequently asked questions about PurEssence's natural health products, shipping, returns, and more."
};

const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "FAQs - PurEssence Ltd",
    "url": "https://test.puressenceltd.co.uk/faqs",
    "description": "Answers to common questions about our products and services.",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What are the benefits of your products?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our products are natural, organic, and designed to boost your health and immunity."
            }
        },
        {
            "@type": "Question",
            "name": "Do you offer international shipping?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we ship to select countries worldwide. Contact us for more details."
            }
        }
    ]
};

export default function FAQsLayout({ children }) {
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
