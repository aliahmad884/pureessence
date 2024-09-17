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