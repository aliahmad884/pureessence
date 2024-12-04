"use client"
import { ProductCard } from "@/components/cards";
import FallBackLoader from "@/components/loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { loadCache, saveCache } from "@/options";

export default function ProductPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [apiData, setApiData] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            const cachedData = await loadCache('product')
            if (cachedData) {
                setApiData(cachedData)
                setIsLoading(false)
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
            finally {
                setIsLoading(false)
            }
        }
        fetchProducts();

    }, [])

    if (isLoading) return <FallBackLoader />
    return (
        <>
            <Toaster />
            <div className="productPageBanner">
                <h1>Products</h1>
            </div>
            <div className="productPage">
                <div className="productsCont">
                    {/* {
                        data.map(data => <ProductCard key={data.id} id={data.id} price={data.price} imgUrl={data.imgUrl} title={data.title} qty={data.qty} data={data} shortDes={data.shortDes} slug={data.slug} />)
                    } */}
                    {
                        apiData.map(data => <ProductCard key={data.id} id={data.id} price={data.price} imgUrl={data.pImages[0]} title={data.pName} qty={data.qty} data={data} shortDes={data.sDesc} slug={data.slug} />)
                    }
                </div>
            </div>
        </>
    )
}