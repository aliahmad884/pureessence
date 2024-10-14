"use client"

import BlogNav from "@/components/blogNavPanel";
import { BlogCard } from "@/components/cards";

export default function BlogsPage() {
    return (
        <>
            <div className="blogPage">
                <h1>Explore Our Blogs & Health Guides</h1>
                <div className="blogsCont">
                    <BlogCard type={'Health Guide'} slug={'/blogs/blog1'} />
                    <BlogCard type={'Thoughts'} slug={'/blogs/blog2'} />
                    <BlogCard type={'Health Guide'} slug={'/blogs/blog3'} />
                    <BlogCard type={'Blog'} slug={'/blogs/blog3'} />
                </div>
            </div>
        </>
    )
}