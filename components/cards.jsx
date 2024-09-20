import { useDataContext } from "@/context";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
export function ProductCard({ imgUrl, title, price, obj }) {
    const { cartData, setCartData } = useDataContext()
    const handleCart = (data) => {
        let find = cartData.find(item => item.id === data.id)
        setCartData(pre => !find ? [...pre, data] : [...pre])
    }
    return (
        <>
            <div className="productCard">
                <img src={imgUrl} alt={title} />
                <h2>{title}</h2>
                <p>{price}</p>
                <button onClick={() => handleCart(obj)} type="button">Add to Cart</button>
            </div>
        </>
    )
}