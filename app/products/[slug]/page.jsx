'use client'

import { useDataContext } from "@/context"
import ProductData from "@/data"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

// export async function generateMetadata({ params }) {
//     const { slug } = params;
//     const decodedSlug = decodeURIComponent(slug);
//     const product = ProductData.find(data => data.slug === decodedSlug);

//     return {
//         title: product ? product.title : "Product Not Found",
//     };
// }

export default function Products({ params }) {
    const { slug } = params
    const decodedSlug = decodeURIComponent(slug)
    const product = ProductData.find(data => data.slug === decodedSlug)
    const [imgPath, setImgPath] = useState(product.imgUrl)
    const { cartData, setCartData } = useDataContext()
    const handleCart = () => {
        let find = cartData.find(item => item.id === product.id)
        if (!find) {
            setCartData(pre => [...pre, product])
            toast.success('Item Added to the Cart.')
        }
        else {
            toast.success('Item already on Cart.', {
                icon: <FontAwesomeIcon style={{ color: 'cadetblue', fontSize: '1.5rem' }} icon={faInfoCircle} />
            })
            return null;
        }
    }
    return (
        <>
            <Toaster />
            <div className="productSlugCont">
                <div className="productSlug">
                    <div className="imgCont">
                        <div className="thumbnails">
                            <img onClick={() => setImgPath(product.imgUrl)} src={product.imgUrl} alt="Main Image" />
                            {
                                product.images ? product.images.map((img, i) => <img onClick={() => setImgPath(img)} key={i} src={img} alt={img} />) : null
                            }
                        </div>
                        <div className="mainImg">
                            <img src={imgPath} alt={product.title} />
                        </div>
                    </div>
                    <div className="detailsCont">
                        <h1>{product.title}</h1>
                        <p>{product.shortDes}</p>
                        <h3>&pound;{product.price} GBP</h3>
                        <button onClick={handleCart} style={(product.stock === 'out of stock') ? { backgroundColor: 'grey' } : null} disabled={(product.stock === 'out of stock') ? true : false} type="button">{(product.stock === 'out of stock') ? product.stock : 'Add to Cart'}</button>
                        <h4><strong>Availability :</strong> {product.stock}</h4>
                        <div>
                            <a href="#">Ask Us Question</a> &nbsp;
                            <Link href={'/products'}>Back To Products</Link>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="overViewCont">
                    {/* <div className="tabs">
                        <button type="button">Product Overview</button>
                        <button type="button">Advisory Information</button>
                    </div> */}
                    <div className="output">
                        <h1>Product Overview</h1>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </>
    )
}