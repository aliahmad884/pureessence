"use client"
import React from "react";
import Slider from "react-slick";
import { ProductCard } from "./cards";
import { Toaster } from "react-hot-toast";
import ProductData from "@/data";

export default function PopularProducts() {
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
                <h1>Popular Products</h1>
                <div className="slider">
                    <Slider {...settings} style={{ padding: '0 -15px' }}>
                        {
                            data.map(data => <ProductCard key={data.id} id={data.id} imgUrl={data.imgUrl} title={data.title} price={data.price} qty={data.qty} data={data} slug={data.slug} />)
                        }
                    </Slider>
                </div>
            </div>
        </>
    )
}