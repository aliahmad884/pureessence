"use client"

import { BlogCard } from "@/components/cards";
import FallBackLoader from "@/components/loader";
import { loadCache, saveCache } from "@/options";
import { useEffect, useState } from "react";

export default function BlogsPage() {
    const CACHE_TIME_STAMP = 86400000;
    const CACHE_KEY = 'blog'
    const [blogs, setBlogs] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchBlogs = async () => {
            const cachedData = await loadCache(CACHE_KEY)
            if (cachedData) {
                let limit = cachedData.slice(cachedData.length - 3, cachedData.length).reverse()
                // console.log(limit)
                setBlogs(limit)
                setIsLoading(false)
                return;
            }
            try {
                let res = await fetch('/api/blog')
                let result = await res.json()
                setBlogs(result)
                await saveCache(result, CACHE_KEY)
            }
            catch (err) {
                console.log('Error on blogs api')
                console.error(err)
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchBlogs()
    }, [])
    if (isLoading) return <FallBackLoader />
    return (
        <>
            <div className="blogPage">
                <h1>Explore Our Blogs & Health Guides</h1>
                <div className="blogsCont">
                    {
                        blogs && blogs.map((blog, i) => <BlogCard key={i} type={blog.bCategory} slug={blog.bCategory === 'Blog' ? `/blogs/${blog.bSlug}` : `/blogs/health-guides/${blog.bSlug}`} imgSrc={blog.bTitleImg} title={blog.bTitle} sDesc={blog.bShortDesc} />)
                    }
                </div>

            </div>
        </>
    )
}