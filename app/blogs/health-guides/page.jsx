import { BlogCard } from "@/components/cards";

export default function GuidesPage() {
    return (
        <>
            <div className="blogPage">
                <h1>Health Guides</h1>
                <div className="blogsCont">
                    <BlogCard type={'Health Guide'} slug={`/blogs/health-guides/guide1`} />
                    <BlogCard type={'Health Guide'} slug={`/blogs/health-guides/guide2`} />
                    <BlogCard type={'Health Guide'} slug={`/blogs/health-guides/guide3`} />
                    <BlogCard type={'Health Guide'} slug={`/blogs/health-guides/guide4`} />
                    <BlogCard type={'Health Guide'} slug={`/blogs/health-guides/guide5`} />
                </div>
            </div>
        </>
    )
}