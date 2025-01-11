import Head from 'next/head';

export const metadata = {
    title: 'Blogs | PurEssence | The Purest Products, For a Better You',
    description: "Read our blogs for insights into natural health, product benefits, and wellness tips. Stay informed with PurEssence's latest articles and updates."
};

const fetchBLogsData = async () => {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/blog`);
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


export default async function BlogsLayout({ children }) {
    const blogs = await fetchBLogsData()
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "PurEssence Blogs",
        "url": "https://test.puressenceltd.co.uk/blogs",
        "description": "Insights and tips on natural health and wellness.",
        "blogPost": blogs.map((blog, index) => ({
            "@type": "BlogPosting",
            "headline": blog.bTitle,
            "url": `https://test.puressenceltd.co.uk/blogs/${blog.bCategory === 'Blog' ? blog.bSlug : (`health-guides/${blog.bSlug}`)}`,
            "image": `https://test.puressenceltd.co.uk/${blog.bTitleImg}`,
            "datePublished": blog.date
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
