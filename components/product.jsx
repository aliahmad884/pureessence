"use client"
import React from "react";
import Slider from "react-slick";
import { ProductCard } from "./cards";
import { Toaster } from "react-hot-toast";

export default function PopularProducts() {
    const data = [
        {
            id: 1,
            imgUrl: 'https://www.naturesblends.com/cdn/shop/files/2DA706A9-E629-4001-9CB9-DF98EEAEAA47.png?v=1719842366',
            title: 'Black Seed Oil Capsulesdsad',
            price: '1500',
            qty: 1
        },
        {
            id: 2,
            imgUrl: 'https://www.naturesblends.com/cdn/shop/files/1A51CF18-D901-47B8-870E-0BCA5233723D.png?v=1716582594',
            title: 'Black Seed Oil Capsules',
            price: '1500',
            qty: 1
        },
        {
            id: 3,
            imgUrl: 'https://www.naturesblends.com/cdn/shop/products/bso-100ml.jpg?v=1630766393',
            title: 'Black Seed Oil, Ethiopian, Raw Virgin Cold Pressed (100ml)',
            price: '1500',
            qty: 3
        },
        {
            id: 4,
            imgUrl: 'https://www.naturesblends.com/cdn/shop/files/DB57BCEC-8830-4BA7-93CA-558E8B212750.jpg?v=1716581484',
            title: 'Black Seed & Turmeric Vegan Capsules',
            price: '1500',
            qty: 1
        },
        {
            id: 5,
            imgUrl: 'https://www.naturesblends.com/cdn/shop/products/25g-shilajit-bottle.jpg?v=1630766451',
            title: 'Shilajit | Raw Shilajit Power 25g (Pakistan Origin )',
            price: '1500',
            qty: 1
        },
        {
            id: 6,
            imgUrl: 'https://www.naturesblends.com/cdn/shop/products/image.png?v=1635894910',
            title: 'Black Seed & Manuka Honey 83+ MGO (250g)',
            price: '1500',
            qty: 1
        }
    ]
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
                    <Slider {...settings}>
                        {
                            data.map(data => <ProductCard key={data.id} id={data.id} imgUrl={data.imgUrl} title={data.title} price={data.price} qty={data.qty} data={data} />)
                        }
                    </Slider>
                </div>
            </div>
        </>
    )
}