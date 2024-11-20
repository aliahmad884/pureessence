// import { faCalendar } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// export default function Blogs() {
//     return (
//         <>
//             <div className="blogsCont">
//                 <h1>Health Guides</h1>
//                 <div className="cardCont">
//                     <div className="card">
//                         <div className="imgCont">
//                             <img loading="lazy"  src="/logos/PE-Small-Text-Logo.png" alt="blog photo" />
//                             {/* <div className="overLay">
//                                 <FontAwesomeIcon icon={faCalendar} /> <time dateTime="2024-09-23T15:00">20-Sep-2024</time>
//                             </div> */}
//                         </div>
//                         <h2>Coming Soon</h2>
//                         <p>Coming Soon</p>
//                         <h3>By PurEssence</h3>
//                     </div>
//                     <div className="card">
//                         <div className="imgCont">
//                             <img loading="lazy"  src="/logos/PE-Small-Text-Logo.png" alt="blog photo" />
//                             {/* <div className="overLay">
//                                 <FontAwesomeIcon icon={faCalendar} /> <time dateTime="2024-09-23T15:00">20-Sep-2024</time>
//                             </div> */}
//                         </div>
//                         <h2>Coming Soon</h2>
//                         <p>Coming Soon</p>
//                         <h3>By PurEssence</h3>
//                     </div>
//                     <div className="card">
//                         <div className="imgCont">
//                             <img loading="lazy"  src="/logos/PE-Small-Text-Logo.png" alt="blog photo" />
//                             {/* <div className="overLay">
//                                 <FontAwesomeIcon icon={faCalendar} /> <time dateTime="2024-09-23T15:00">20-Sep-2024</time>
//                             </div> */}
//                         </div>
//                         <h2>Coming Soon</h2>
//                         <p>Coming Soon</p>
//                         <h3>By PurEssence</h3>
//                     </div>
//                 </div>
//                 {/* <div className="moreBtn">
//                     <button type="button">View More</button>
//                 </div> */}
//             </div>
//         </>
//     )
// }

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