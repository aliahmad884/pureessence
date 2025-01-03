"use client"

import { useDataContext } from "@/context";
import { faCartShopping, faEye, faInfoCircle, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link"
import Image from "next/image";

export default function ReviewCard() {
    return (
        <div className="reviewCard">
            <img loading="lazy" src="/CircleLogo.webp" alt="Logo" />
            <h2>Bob Honeyson</h2>
            <p>Testimonials are short quotes from people who love your brand. It&apos;s a great way to convince customers to try your products.</p>
            <div className="stars">
                <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
            </div>
        </div>
    )
}
export function ProductCard({ id, imgUrl, title, price, qty, data, shortDes, slug, status }) {
    const router = useRouter()

    const { cartData, setCartData } = useDataContext()
    const handleCart = () => {

        let user = localStorage.getItem('user')
        let find = cartData.find(item => item.id === id)
        if (!find) {
            setCartData(pre => [...pre, data])
            toast.success('Item Added to the Cart.')
        }
        else {
            toast.success('Please Edit Quantity in Cart.', {
                icon: <FontAwesomeIcon style={{ color: 'cadetblue', fontSize: '1.5rem' }} icon={faInfoCircle} />
            })
            return null;
        }
        if (user) {
            const loggedUser = JSON.parse(user)
            fetch('/api/userCart', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    userId: loggedUser.email,
                    imgUrl: imgUrl,
                    title: title,
                    price: price,
                    qty: qty,
                    slug: slug
                })
            }).catch(err => console.log(err))
        }


    }
    return (
        <>
            <div className="productCard">
                <div style={{ backgroundImage: `url('/api/uploadImg?path=${encodeURIComponent(imgUrl)}')` }} className="img"></div>
                {/* <img loading="lazy"  src={imgUrl} alt={title} /> */}
                <h2>{title}</h2>
                <h3>{shortDes}</h3>
                <p>{(status === 'out of stock') ? <strong style={{ color: 'red' }}>Out of Stock</strong> : (<>&pound;{price}</>)}</p>
                <div className="btnCont">
                    <Link style={{ textAlign: 'center' }} href={`/products/${slug}`} className="btnPreview"><FontAwesomeIcon icon={faEye} /> View</Link>
                    <FontAwesomeIcon style={(status === 'out of stock') ? { display: 'none' } : null} onClick={() => handleCart()} className="addToCart" icon={faCartShopping} />
                </div>
            </div>
        </>
    )
}
export function BlogCard({ type, slug, imgSrc, title, sDesc }) {
    return (
        <>
            <div className="blogCardCont">
                <div className="img">
                    <Link href={`${slug}`}>
                        <Image
                            src={imgSrc ? `/api/uploadImg?path=${encodeURIComponent(imgSrc)}` : '/plastics.png'}
                            alt="Temp Img"
                            sizes="100vw"
                            style={{
                                width: '100%',
                                height: "auto"
                            }}
                            width={500}
                            height={300}
                        />
                    </Link>
                </div>
                <p>{type}</p>
                <h2><Link href={`${slug}`}>{title}</Link></h2>
                <p>{sDesc}</p>
            </div>
        </>
    )
}
