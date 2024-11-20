"use client"
import { cacheBlogs } from "@/cache";
import FallBackLoader from "@/components/loader";
import { loadCache, saveCache } from "@/options";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogSlug({ params }) {
    const CACHE_TIME_STAMP = 86400000;
    const CACHE_KEY = 'blog'
    const { slug } = params;
    const [postUrl, setPostUrl] = useState("")
    const [blog, setBlog] = useState('')
    const [sanitizedHtml, setSanitizedHtml] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const decodedSlug = decodeURIComponent(slug)
    const sanitizeHtml = (html) => {
        const clearHtml = DOMPurify.sanitize(html, {
            ADD_TAGS: ["iframe"],
            ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"]
        })
        return clearHtml;
    }
    useEffect(() => {
        setPostUrl(`${window.location.href}`)
        console.log('current url', window.location.href)
        const fetchBlog = async () => {
            const cachedData = await loadCache(CACHE_KEY)
            if (cachedData) {
                let find = cachedData.find(b => b.bSlug === decodedSlug)
                setBlog(find)
                setIsLoading(false)
                const clearHtml = sanitizeHtml(find.blogHtml)
                setSanitizedHtml(clearHtml)
                return;
            }
            try {
                let res = await fetch(`/api/blog?slug=${slug}`);
                let result = await res.json()
                const clearHtml = sanitizeHtml(result.blogHtml)
                setSanitizedHtml(clearHtml)
                setBlog(result)
            }
            catch (err) {
                console.err(err)
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchBlog()
    }, [])

    if (isLoading) return <FallBackLoader />
    return (
        <>
            {blog &&
                <div className="postReader">
                    <div className="readerCont">
                        <div className="readerHeader">
                            <div className="breadCrumbs" aria-label="breadcrumb">
                                <Link href={'/blogs'}><FontAwesomeIcon icon={faArrowLeft} />  Blogs</Link>
                            </div>
                            <div className="postHeader">
                                <p>Published: {new Date(blog.date).toDateString()} in <Link href={'/blogs'}>Blogs</Link></p>
                                <h1>{blog.bTitle}</h1>
                                <h2>By {blog.bAuthor}</h2>
                            </div>
                        </div>
                        <div className="img">
                            <Image
                                src={`/api/uploadImg?path=${encodeURIComponent(blog.bTitleImg)}`}
                                alt={blog.bTitle}
                                sizes="100vw"
                                height={1000}
                                width={1000}
                                style={{
                                    width: '100%',
                                    height: 'auto'
                                }}
                            />
                        </div>
                        <div className="mainBody">
                            <div className="shareCont">
                                <h3 style={{ fontWeight: 'bold' }}>5 Min Read</h3>
                                <br />
                                <p>Share this post</p>
                                <div className="sIcons">
                                    <Link
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=Some Text to share on Twitter`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    ><Image src={'/iconImgs/twitter.webp'} alt="Twitter" height={30} width={30} /></Link>
                                    <Link
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    ><Image src={'/iconImgs/facebook.webp'} alt="Facebook" height={30} width={30} /></Link>
                                    <Link
                                        href={`https://wa.me/?text=${encodeURIComponent(postUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    ><Image src={'/iconImgs/whatsapp.webp'} alt="Whatsapp" height={30} width={30} /></Link>
                                </div>
                            </div>
                            <div className="postContent" dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}