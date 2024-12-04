"use client"
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { ProductCard } from "./cards";
import { Toaster } from "react-hot-toast";
import ProductData from "@/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { loadCache, saveCache } from "@/options";

export default function PopularProducts() {
    const [apiData, setApiData] = useState([])
    useEffect(() => {
        const fetchProducts = async () => {
            const cachedData = await loadCache('product')
            if (cachedData) {
                setApiData(cachedData)
                return;
            }
            try {
                let res = await fetch('/api/product');
                let result = await res.json();
                await saveCache(result, 'product')
                setApiData(result);
            }
            catch (err) {
                console.log('Error From Product Api Call: ')
                console.error(err)
            }
        }
        fetchProducts();
    }, [])
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1250,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 940,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <>
            <Toaster />
            <div className="productCont">
                <h1>Latest Products</h1>
                <div className="slider">
                    <Slider ref={slider => { sliderRef = slider }} {...settings} style={{ padding: '0 -15px' }}>
                        {
                            apiData.map(data => <ProductCard key={data.id} id={data.id} price={data.price} imgUrl={data.pImages[0]} title={data.pName} qty={data.qty} data={data} shortDes={data.sDesc} slug={data.slug} />)
                        }
                    </Slider>

                    <div className="controlls">
                        <button onClick={previous} type="button"><FontAwesomeIcon icon={faArrowLeft} /></button>
                        <button onClick={next} type="button"><FontAwesomeIcon icon={faArrowRight} /></button>
                    </div>
                    <div style={{ textAlign: 'center', width: '100%', marginTop: '30px', textDecoration: 'underline' }}>
                        <Link style={{ fontWeight: 'bolder' }} href={'/products'}>View All Products</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
