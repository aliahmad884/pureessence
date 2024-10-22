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
export function ProductCard({ id, imgUrl, title, price, qty, data, shortDes, slug }) {
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
                    qty: qty
                })
            }).catch(err => console.log(err))
        }


    }
    return (
        <>
            <div className="productCard">
                <div style={{ backgroundImage: `url('${imgUrl}')` }} className="img"></div>
                {/* <img loading="lazy"  src={imgUrl} alt={title} /> */}
                <h2>{title}</h2>
                <h3>{shortDes}</h3>
                <p>&pound;{price}</p>
                <div className="btnCont">
                    <Link style={{ textAlign: 'center' }} href={`/products/${slug}`} className="btnPreview"><FontAwesomeIcon icon={faEye} /> View</Link>
                    {/* <button className="addToCart" onClick={() => handleCart()} type="button">Add to Cart</button> */}
                    <FontAwesomeIcon onClick={() => handleCart()} className="addToCart" icon={faCartShopping} />
                </div>
            </div>
        </>
    )
}
export function BlogCard({ type, slug }) {
    return (
        <>
            <div className="blogCardCont">
                <div className="img">
                    <Link href={`${slug}`}>
                        <Image
                            src={'/plastics.png'}
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
                <h2><Link href={`${slug}`}>Lorem Ipsum site lowub loyibtiq</Link></h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas suscipit maiores vero animi modi totam earum magnam expedita temporibus, libero provident sint ipsa dignissimos veritatis odio, aut numquam blanditiis. Quia.</p>
            </div>
        </>
    )
}
