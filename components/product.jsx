"use client"
import React, { useRef } from "react";
import Slider from "react-slick";
import { ProductCard } from "./cards";
import { Toaster } from "react-hot-toast";
import ProductData from "@/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function PopularProducts() {
    let sliderRef = useRef(null);
    const next = () => {
        sliderRef.slickNext();
    };
    const previous = () => {
        sliderRef.slickPrev();
    };
    const data = ProductData
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
                            data.map(data => <ProductCard key={data.id} id={data.id} imgUrl={data.imgUrl} title={data.title} qty={data.qty} data={data} slug={data.slug} />)
                        }
                    </Slider>

                    <div className="controlls">
                        <button onClick={previous} type="button"><FontAwesomeIcon icon={faArrowLeft} /></button>
                        <button onClick={next} type="button"><FontAwesomeIcon icon={faArrowRight} /></button>
                    </div>
                    <div style={{textAlign:'center',width:'100%',marginTop:'30px',textDecoration:'underline'}}>
                        <Link href={'/products'}>View all products</Link>
                    </div>
                </div>
            </div>
        </>
    )
}