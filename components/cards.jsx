import { useDataContext } from "@/context";
import { faCartShopping, faEye, faInfoCircle, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ReviewCard() {
    return (
        <div className="reviewCard">
            <img src="/CircleLogo.webp" alt="Logo" />
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
            toast.success('Item already on Cart.', {
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
                {/* <img src={imgUrl} alt={title} /> */}
                <h2>{title}</h2>
                <h3>{shortDes}</h3>
                <p>{price}&pound;</p>
                <div className="btnCont">
                    <button onClick={() => router.push(`/products/${slug}`)} className="btnPreview" type="button"><FontAwesomeIcon icon={faEye}/> View</button>
                    {/* <button className="addToCart" onClick={() => handleCart()} type="button">Add to Cart</button> */}
                    <FontAwesomeIcon onClick={() => handleCart()} className="addToCart" icon={faCartShopping} />
                </div>
            </div>
        </>
    )
}