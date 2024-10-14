"use client"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogSlug({ params }) {
    const { slug } = params;
    const [postUrl, setPostUrl] = useState("")
    const [sanitizedHtml, setSanitizedHtml] = useState(null)
    const decodedSlug = decodeURIComponent(slug)
    let html = ``;
    useEffect(() => {
        setPostUrl(`${window.location.origin}/blogs/${slug}`)
        const clearHtml = DOMPurify.sanitize(html)
        setSanitizedHtml(clearHtml)
        console.log(encodeURIComponent(`${window.location.origin}/blogs/${slug}`))
    }, [])
    return (
        <>
            <div className="postReader">
                <div className="readerCont">
                    <div className="readerHeader">
                        <div className="breadCrumbs" aria-label="breadcrumb">
                            <Link href={'/blogs'}><FontAwesomeIcon icon={faArrowLeft} />  Blogs</Link>
                        </div>
                        <div className="postHeader">
                            <p>Published October 9, 2024 in <Link href={'/blogs'}>Blogs</Link></p>
                            <h1>Lorem Ipsum uyhteq</h1>
                            <h2>By Haji Robert Wilson</h2>
                        </div>
                    </div>
                    <div className="img">
                        <Image
                            src={'/PE-Bath-Oils.webp'}
                            alt="Temp Image"
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
                                ><Image src={'/twitter.webp'} alt="Twitter" height={30} width={30} /></Link>
                                <Link
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                ><Image src={'/facebook.webp'} alt="Facebook" height={30} width={30} /></Link>
                                <Link
                                    href={`https://wa.me/?text=${encodeURIComponent(`Check this out ${postUrl}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                ><Image src={'/whatsapp.webp'} alt="Whatsapp" height={30} width={30} /></Link>
                                <Link
                                    href={`https://wa.me/?text=${postUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                ><Image src={'/whatsapp.webp'} alt="Whatsapp" height={30} width={30} /></Link>
                            </div>
                        </div>
                        {/* <div className="postContent" dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div> */}
                        <div className="postContent">
                            Over the past few years, the number of data assets and systems Notion uses has skyrocketed. That increase has made it essential to develop a robust, easy-to-use data catalog. In this post well guide you through the hurdles we encountered and the solutions we implemented. The evolution of our data catalog has been marked by three distinct phases.
                            <br />
                            <br />
                            <br />
                            <h2 style={{ fontSize: '2rem' }}>Phase One: Living in the early chaos of the Wild West</h2>
                            Notion began without a data catalog. Our data grew organically and chaotically, stored mostly in unstructured formats like JSON. This approach was supported by tools like Amplitude, which facilitated rapid data integration and analysis without the need for strict data management practices. We prioritized speed in order to accommodate a diverse audience, from developers to data scientists to product managers.

                            These early choices resulted in many pitfalls:

                            Our data environment was marked by tribal knowledge without formal guidelines or standards to ensure naming consistency and data standardization.

                            The absence of a structured system made it difficult to classify data events as critical or non-critical when making product decisions.

                            Unclear ownership and responsibilities led to frequent governance and quality issues (e.g. a mistakenly updated event broke downstream consumers of the data).

                            Data can drive product decision-making, but without data discoverability, teams were potentially unaware of the resources at their disposal.

                            <br /><br /><br />
                            Finally, our use of diverse data sources—including data warehouses, stream processing, various data lakes, and operational data stores—further complicated our data ecosystem.

                            This disarray became a fundamental challenge that our engineering team needed to overcome in order to enhance data utility and governance as Notion grew and expanded our operations.

                            Phase Two: Laying a firm foundation with building blocks
                            Our first step in bringing order to our data landscape was to select and utilize a data catalog, Acryl DataHub, which would link directly to our data warehouse for displaying table names and their schemas. We also created an event tiering and ownership system (P0, P1, etc), which allowed us to ensure the availability of owners to maintain the most important events.

                            Despite this integration&apos;s technical success, we soon noticed that the new system was delivering lower-than-expected user engagement.


                            Over the past few years, the number of data assets and systems Notion uses has skyrocketed. That increase has made it essential to develop a robust, easy-to-use data catalog. In this post well guide you through the hurdles we encountered and the solutions we implemented. The evolution of our data catalog has been marked by three distinct phases.
                            <br />
                            <br />
                            <br />
                            <h2 style={{ fontSize: '2rem' }}>Phase One: Living in the early chaos of the Wild West</h2>
                            Notion began without a data catalog. Our data grew organically and chaotically, stored mostly in unstructured formats like JSON. This approach was supported by tools like Amplitude, which facilitated rapid data integration and analysis without the need for strict data management practices. We prioritized speed in order to accommodate a diverse audience, from developers to data scientists to product managers.

                            These early choices resulted in many pitfalls:

                            Our data environment was marked by tribal knowledge without formal guidelines or standards to ensure naming consistency and data standardization.

                            The absence of a structured system made it difficult to classify data events as critical or non-critical when making product decisions.

                            Unclear ownership and responsibilities led to frequent governance and quality issues (e.g. a mistakenly updated event broke downstream consumers of the data).

                            Data can drive product decision-making, but without data discoverability, teams were potentially unaware of the resources at their disposal.

                            <br /><br /><br />
                            Finally, our use of diverse data sources—including data warehouses, stream processing, various data lakes, and operational data stores—further complicated our data ecosystem.

                            This disarray became a fundamental challenge that our engineering team needed to overcome in order to enhance data utility and governance as Notion grew and expanded our operations.

                            Phase Two: Laying a firm foundation with building blocks
                            Our first step in bringing order to our data landscape was to select and utilize a data catalog, Acryl DataHub, which would link directly to our data warehouse for displaying table names and their schemas. We also created an event tiering and ownership system (P0, P1, etc), which allowed us to ensure the availability of owners to maintain the most important events.

                            Despite this integration&apos;s technical success, we soon noticed that the new system was delivering lower-than-expected user engagement.


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}