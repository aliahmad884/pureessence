'use client'

import FallBackLoader from "@/components/loader"
import { useDataContext } from "@/context"
import ProductData from "@/data"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import CachedProducts from "@/cache"

export default function Products({ params }) {
    const router = useRouter();
    const { slug } = params;
    const decodedSlug = decodeURIComponent(slug);
    // const product = ProductData.find(data => data.slug === decodedSlug);
    const { cartData, setCartData } = useDataContext();
    const [isLoading, setIsLoading] = useState(true);
    const [showImgFull, setShowImgFull] = useState(false);
    const [product, setProduct] = useState()
    const [imgPath, setImgPath] = useState();
    const handleCart = () => {
        let find = cartData.find(item => item.id === product.id);
        if (!find) {
            setCartData(pre => [...pre, product]);
            toast.success('Item Added to the Cart.');
        }
        else {
            toast.success('Please Edit Quantity in Cart.', {
                icon: <FontAwesomeIcon style={{ color: 'cadetblue', fontSize: '1.5rem' }} icon={faInfoCircle} />
            });
            return null;
        }
    }
    useEffect(() => {
        const fetchProduct = async () => {
            if (CachedProducts.products) {
                let result = CachedProducts.products.find(p => p.slug === slug)
                setProduct(result)
                setIsLoading(false);
                return;
            }
            try {
                let res = await fetch(`/api/product?slug=${slug}`)
                let result = await res.json()
                setProduct(result)
            }
            catch (err) {
                console.log('Error From Single Product Api Call: ')
                console.error(err)
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchProduct();
        let mainImg = document.querySelector('.mainImg');
        let img = document.getElementById('img');
        const handlePortal = (event) => {
            if (showImgFull && !mainImg.contains(event.target) && !img.contains(event.target)) {
                setShowImgFull(false);
                document.body.removeAttribute('style');
            }
        }
        document.addEventListener('click', handlePortal);
        return () => {
            document.removeEventListener('click', handlePortal);
        }
    }, [showImgFull]);
    useEffect(() => {
        if (product) document.title = product.pName;
        else document.title = 'Page Not Found'
    }, [product])
    if (isLoading) return <FallBackLoader />
    return (
        <>
            <Toaster />
            {product &&
                <div className="productSlugCont">
                    <div className="productSlug">
                        <div className="imgCont">
                            <div className="thumbnails">
                                {
                                    product.pImages && product.pImages.map((img, i) => <img loading="lazy" onClick={() => setImgPath(img)} key={i} src={img} alt={img} />)
                                }
                            </div>
                            <div className="mainImg">
                                <img loading="lazy" onClick={() => setShowImgFull(true)} src={imgPath ? imgPath : product.pImages[0]} alt={product.pName} />
                                {showImgFull && createPortal(<>
                                    <div className="imgPortalCont">
                                        <img loading="lazy" id='img' onClick={() => window.open(imgPath ? imgPath : product.pImages[0], '_blank')} src={imgPath ? imgPath : product.pImages[0]} alt={product.pName} />
                                    </div>
                                </>, document.body)}
                            </div>
                        </div>
                        <div className="detailsCont">
                            <h1>{product.pName}</h1>
                            <p>{product.sDesc}</p>
                            <h3 style={{ width: 'fit-content' }}>&pound;{product.price}</h3>
                            <button
                                onClick={handleCart}
                                // style={(product.stock === 'out of stock') ? { backgroundColor: 'grey' } : null}
                                // disabled={(product.stock === 'out of stock') ? true : false}
                                type="button">
                                {/* {(product.stock === 'out of stock') ? product.stock : 'Add to Cart'} */}
                                Add to Cart
                            </button>
                            {/* <h4><strong>Availability :</strong></h4> */}
                            <div>
                                <Link href="/contact">Ask Us a Question</Link> &nbsp;
                                <Link href={'/products'}>Back To Products</Link>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="overViewCont">
                        <div className="output">
                            <h1>Product Overview</h1>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
