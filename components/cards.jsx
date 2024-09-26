import { useDataContext } from "@/context";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import toast, { Toaster } from "react-hot-toast";
import { Flip, Slide, toast } from "react-toastify";

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
export function ProductCard({ id, imgUrl, title, price, qty, data }) {

    const { cartData, setCartData } = useDataContext()
    const handleCart = () => {
        const options = {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide
        }

        let user = localStorage.getItem('user')
        if (user) {
            const loggedUser = JSON.parse(user)
            fetch('/api/userCart', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: loggedUser.email,
                    imgUrl: imgUrl,
                    title: title,
                    price: price,
                    qty: qty
                })
            }).then(res => {
                if (res.status === 400) {
                    toast.info('Item already on Cart.', options)
                    return null;
                }
                return res.json()
            }).then(result => {
                if (result) {
                    const { userId, ...item } = result.res;
                    setCartData(pre => [...pre, item])
                    toast.success('Item Added to the Cart.', options);
                }
            }).catch(err => console.log(err))
        }
        else {
            let find = cartData.find(item => item.id === id)
            if (!find) {
                setCartData(pre => [...pre, data])
                toast.success('Item Added to the Cart.', options)
            }
            else {
                toast.info('Item already on Cart.', options)
            }
        }


    }
    return (
        <>
            <div className="productCard">
                <img src={imgUrl} alt={title} />
                <h2>{title}</h2>
                <p>{price}</p>
                <button onClick={() => handleCart()} type="button">Add to Cart</button>
            </div>
        </>
    )
}