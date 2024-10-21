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

export default function Products({ params }) {
    const router = useRouter()
    const { slug } = params
    const decodedSlug = decodeURIComponent(slug)
    const product = ProductData.find(data => data.slug === decodedSlug)
    const [imgPath, setImgPath] = useState(product.imgUrl)
    const { cartData, setCartData } = useDataContext()
    const [isLoading, setIsLoading] = useState(true)
    const [showImgFull, setShowImgFull] = useState(false)
    const handleCart = () => {
        let find = cartData.find(item => item.id === product.id)
        if (!find) {
            setCartData(pre => [...pre, product])
            toast.success('Item Added to the Cart.')
        }
        else {
            toast.success('Please Edit Quantity in Cart.', {
                icon: <FontAwesomeIcon style={{ color: 'cadetblue', fontSize: '1.5rem' }} icon={faInfoCircle} />
            })
            return null;
        }
    }
    useEffect(() => {
        setIsLoading(false)
        let mainImg = document.querySelector('.mainImg')
        let img = document.getElementById('img')
        const handlePortal = (event) => {
            if (showImgFull && !mainImg.contains(event.target) && !img.contains(event.target)) {
                setShowImgFull(false)
                document.body.removeAttribute('style')
            }
        }
        document.addEventListener('click', handlePortal)
        return () => {
            document.removeEventListener('click', handlePortal)
        }
    }, [showImgFull])
    if (isLoading) return <FallBackLoader />
    return (
        <>
            <Toaster />
            <div className="productSlugCont">
                <div className="productSlug">
                    <div className="imgCont">
                        <div className="thumbnails">
                            <img loading="lazy"  onClick={() => setImgPath(product.imgUrl)} src={product.imgUrl} alt="Main Image" />
                            {
                                product.images ? product.images.map((img, i) => <img loading="lazy"  onClick={() => setImgPath(img)} key={i} src={img} alt={img} />) : null
                            }
                        </div>
                        <div className="mainImg">
                            <img loading="lazy"  onClick={() => setShowImgFull(true)} src={imgPath} alt={product.title} />
                            {showImgFull && createPortal(<>
                                <div className="imgPortalCont">
                                    <img loading="lazy"  id='img' onClick={() => window.open(imgPath, '_blank')} src={imgPath} alt={product.title} />
                                </div>
                            </>, document.body)}
                        </div>
                    </div>
                    <div className="detailsCont">
                        <h1>{product.title}</h1>
                        <p>{product.shortDes}</p>
                        <h3 style={{cursor:'pointer',textDecoration:'underline',width:'fit-content'}} onClick={() => window.open('https://wa.me/+4401254411076')}>{product.price}</h3>
                        <button onClick={handleCart} style={(product.stock === 'out of stock') ? { backgroundColor: 'grey' } : null} disabled={(product.stock === 'out of stock') ? true : false} type="button">{(product.stock === 'out of stock') ? product.stock : 'Add to Cart'}</button>
                        <h4><strong>Availability :</strong> {product.stock}</h4>
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
        </>
    )
}
