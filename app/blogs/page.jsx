"use client"

import BlogNav from "@/components/blogNavPanel";
import { BlogCard } from "@/components/cards";

export default function BlogsPage() {
    return (
        <>
            <div className="blogPage">
                <h1>Explore Our Blogs & Health Guides</h1>
                <div className="blogsCont">
                    <BlogCard type={'Health Guide'}/>
                    <BlogCard type={'Thoughts'}/>
                    <BlogCard type={'Health Guide'}/>
                    <BlogCard type={'Blog'}/>
                </div>
            </div>
        </>
    )
}