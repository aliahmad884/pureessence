import ProductData from "@/data";

export async function generateMetadata({ params }) {
    const { slug } = params;
    const decodedSlug = decodeURIComponent(slug);

    // Fetch product data based on slug (can be an async operation if needed)
    const product = ProductData.find((data) => data.slug === decodedSlug);

    return {
        title: product ? product.title : "Product Not Found",
    };
}

export default function ProductLayout({ children }) {
    return (
        <div>
            {/* You can add layout-specific components here */}
            {children}
        </div>
    );
}
