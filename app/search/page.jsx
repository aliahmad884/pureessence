"use client"
import { ProductCard } from "@/components/cards";
import FallBackLoader from "@/components/loader";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { loadCache, saveCache } from "@/options";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchResult() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get('query')
    const [isLoading, setIsLoading] = useState(true);
    const [apiData, setApiData] = useState([]);
    const fetchProducts = async () => {
        const cachedData = await loadCache('product')
        if (cachedData) {
            setIsLoading(false)
            return cachedData;
        }
        try {
            let res = await fetch('/api/product');
            let result = await res.json();
            await saveCache(result, 'product')
            return result
        }
        catch (err) {
            console.log('Error From Product Api Call: ')
            console.error(err)
        }
        finally {
            setIsLoading(false)
        }
    }
    const searchHelper = {
        tokenQuery: (query) => {
            return query.toLowerCase().split(/\s+/)
        },
        searchString: (product) => {
            return `${product.pName} ${product.sDesc} ${product.description}`.toLowerCase().replace(/[^\w\s]/g, '')
        },
        countRelevance: (queryToken, searchString) => {
            let count = 0;
            for (const token of queryToken) {
                if (searchString.includes(token)) count++
            }
            return count;
        }
    }

    const findSearchProduct = async (query) => {
        const products = await fetchProducts()
        const token = searchHelper.tokenQuery(query)
        const arr = []
        for (let i = 0; i < products.length; i++) {
            const string = searchHelper.searchString(products[i])
            const score = searchHelper.countRelevance(token, string)
            arr.push({ product: products[i], score: score })
        }
        let result = arr.filter(product => product.score > 0)
        setApiData(result.map(data => data.product))
    }
    useEffect(() => {
        if (query) {
            document.title = 'Search Results | PurEssence'
            findSearchProduct(query)
        } else {
            router.push('/products')
        }
    }, [query])

    if (isLoading) return <FallBackLoader />
    return (
        <>
            <Toaster />
            <div className="searchPageBanner">
                <h1>{query ? `Search Result for: ${query}` : "Products"}</h1>
            </div>
            <h2 style={{textAlign:'center',fontSize:'1.5em',marginTop:'15px'}}>{apiData.length>0?`${apiData.length} Results Found for '${query}'`:'0 Results Found'}</h2>
            <div className="productPage">
                <div className="productsCont">
                    {apiData.length > 0 ?
                        apiData.map(data => <ProductCard key={data.id} id={data.id} price={data.price} imgUrl={data.pImages[0]} title={data.pName} qty={data.qty} data={data} status={data.status} shortDes={data.sDesc} slug={data.slug} />) :
                        <><h1 style={{ fontSize: '2em', textAlign: 'center' }}>Not results found for &apos;{query}&apos; </h1></>
                    }
                </div>
            </div>
        </>
    )
}