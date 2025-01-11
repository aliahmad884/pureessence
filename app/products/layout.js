import Head from 'next/head';

export const metadata = {
    title: 'Products | PurEssence | The Purest Products, For a Better You',
    description: "Discover the purest health products at PurEssence, including honey, olive oil, immunity boosters, and more. Enhance your well-being with our high-quality natural products."
};

const fetchProductsData = async () => {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/product`);
        if (res.ok) {
            const result = await res.json();
            return result;
        }
        else {
            console.log(res.text);
            return [];
        }
    }
    catch (err) {
        console.error(err)
        return []
    }
}

export default async function ProductsLayout({ children }) {
    const products = await fetchProductsData()
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Products - PurEssence Ltd",
        "url": "https://puressenceltd.co.uk/products",
        "description": "Explore our range of natural health products.",
        "itemListElement": products.map((product, index) => ({
            "@type": "Product",
            "position": index + 1,
            "name": product.pName,
            "url": `https://puressenceltd.co.uk/products/${product.slug}`,
            "image": `https://puressenceltd.co.uk/${product.pImages[0]}`
        }))
    };
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
