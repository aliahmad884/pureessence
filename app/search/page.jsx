"use client"
import { ProductCard } from "@/components/cards";
import FallBackLoader from "@/components/loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { loadCache, saveCache } from "@/options";
import { useSearchParams } from "next/navigation";

export default function SearchResult() {
    const searchParams = useSearchParams()
    const query = searchParams.get('query')
    const [isLoading, setIsLoading] = useState(true);
    const [apiData, setApiData] = useState([]);
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
    const findproduct = {
        inWord: (query, pName) => {
            const pnameWords = pName.split(' ');
            const find = pnameWords.find(word => word.toLowerCase() == query.toLowerCase())
            // console.log('found', find)
            if (find) return true;
        }
    }
    const findSearchProduct = async (query) => {
        setIsLoading(false)
        const cachedData = await loadCache('product')
        const dataArr = []
        // console.log(findproduct.inWord(query, 'Khalta Booster'))
        for (let i = 0; i < cachedData.length; i++) {
            const pName = cachedData[i].pName;
            if (findproduct.inWord(query, cachedData[i].pName)) {
                console.log('product found')
                dataArr.push(cachedData[i])
            }
        }
        setApiData(dataArr)
    }
    useEffect(() => {
        document.title = 'Search Results | PurEssence'
        // fetchProducts();
        if (query) {
            findSearchProduct(query)
        }
    }, [query])

    if (isLoading) return <FallBackLoader />
    return (
        <>
            <Toaster />
            <div className="searchPageBanner">
                <h1>{query ? `Search Result for: ${query}` : "Products"}</h1>
            </div>
            <div className="productPage">
                <div className="productsCont">
                    {/* {
                        data.map(data => <ProductCard key={data.id} id={data.id} price={data.price} imgUrl={data.imgUrl} title={data.title} qty={data.qty} data={data} shortDes={data.shortDes} slug={data.slug} />)
                    } */}
                    {apiData.length > 0 ?
                        apiData.map(data => <ProductCard key={data.id} id={data.id} price={data.price} imgUrl={data.pImages[0]} title={data.pName} qty={data.qty} data={data} status={data.status} shortDes={data.sDesc} slug={data.slug} />) :
                        <><h1 style={{ fontSize: '2em', textAlign: 'center' }}>Not results found for &apos;{query}&apos; </h1></>
                    }
                </div>
            </div>
        </>
    )
}