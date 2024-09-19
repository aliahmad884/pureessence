import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Blogs() {
    return (
        <>
            <div className="blogsCont">
                <h1>Our Recent Blogs</h1>
                <div className="cardCont">
                    <div className="card">
                        <div className="imgCont">
                            <img src="/spices.webp" alt="Spices" />
                            <div className="overLay">
                                <FontAwesomeIcon icon={faCalendar} /> <time datetime="20-Sep=24">20-Sep-2024</time>
                            </div>
                        </div>
                        <h2>Lorem Ipsum Lorem ipsum dolor.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis iusto placeat blanditiis amet saepe quisquam nulla facilis magnam.</p>
                        <h3>By Haji Robert</h3>
                    </div>
                    <div className="card">
                        <div className="imgCont">
                            <img src="/spices.webp" alt="Spices" />
                            <div className="overLay">
                                <FontAwesomeIcon icon={faCalendar} /> <time datetime="20-Sep=24">20-Sep-2024</time>
                            </div>
                        </div>
                        <h2>Lorem Ipsum Lorem ipsum dolor.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis iusto placeat blanditiis amet saepe quisquam nulla facilis magnam.</p>
                        <h3>By Haji Robert</h3>
                    </div>
                    <div className="card">
                        <div className="imgCont">
                            <img src="/spices.webp" alt="Spices" />
                            <div className="overLay">
                                <FontAwesomeIcon icon={faCalendar} /> <time datetime="20-Sep=24">20-Sep-2024</time>
                            </div>
                        </div>
                        <h2>Lorem Ipsum Lorem ipsum dolor.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis iusto placeat blanditiis amet saepe quisquam nulla facilis magnam.</p>
                        <h3>By Haji Robert</h3>
                    </div>
                </div>
                <div className="moreBtn">
                    <button type="button">View More</button>
                </div>
            </div>
        </>
    )
}