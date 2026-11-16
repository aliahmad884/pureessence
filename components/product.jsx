"use client"
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { ProductCard } from "./cards";
import { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight,} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { loadCache, saveCache } from "@/options";

const BREAKPOINTS = [
    { max: 650, slides: 1 },
    { max: 940, slides: 2 },
    { max: 1250, slides: 3 },
]
const DEFAULT_SLIDES = 4
function useSlidesToShow() {
    const [slides, setSlides] = useState(null)

    useEffect(() => {
        const calc = () => {
            const width = window.innerWidth
            const match = BREAKPOINTS.find((b) => width <= b.max)
            return match ? match.slides : DEFAULT_SLIDES
        }
        const update = () => setSlides(calc())
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    return slides
}

export default function PopularProducts() {
    const [apiData, setApiData] = useState([])
    const slidesToShow = useSlidesToShow()

    useEffect(() => {
        const fetchProducts = async () => {
            const cachedData = await loadCache('product')
            if (cachedData) {
                setApiData(cachedData)
                return;
            }
            try {
                let res = await fetch('/api/product?scope=customer');
                if (!res.ok) return null;
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
        slidesToShow,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: false,
    };

    const ready = apiData && apiData.length > 0 && slidesToShow !== null

    return (
        <>
            <Toaster />
            <div className="productCont">
                <h1>Latest Products</h1>
                <div className="slider">
                    {ready &&
                        <Slider ref={slider => { sliderRef = slider }} {...settings} style={{ padding: '0 -15px' }}>
                            {
                                apiData?.map(data => <ProductCard key={data.id} id={data.id} price={data.price} imgUrl={data.pImages[0]} title={data.pName} qty={data.qty} data={data} status={data.status} shortDes={data.sDesc} slug={data.slug} />)
                            }
                        </Slider>}

                    <div className="controlls">
                        <button aria-label="Previous Product" onClick={previous} type="button"><FontAwesomeIcon icon={faArrowLeft} /></button>
                        <button aria-label="Next Product" onClick={next} type="button"><FontAwesomeIcon icon={faArrowRight} /></button>
                    </div>
                    <div style={{ textAlign: 'center', width: '100%', marginTop: '30px', textDecoration: 'underline' }}>
                        <Link style={{ fontWeight: 'bolder' }} href={'/products'}>View All Products</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
