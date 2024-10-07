import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Blogs() {
    return (
        <>
            <div className="blogsCont">
                <h1>Health Guides</h1>
                <div className="cardCont">
                    <div className="card">
                        <div className="imgCont">
                            <img src="/logos/PE-Small-Text-Logo.png" alt="blog photo" />
                            {/* <div className="overLay">
                                <FontAwesomeIcon icon={faCalendar} /> <time dateTime="2024-09-23T15:00">20-Sep-2024</time>
                            </div> */}
                        </div>
                        <h2>Coming Soon</h2>
                        <p>Coming Soon</p>
                        <h3>By PurEssence</h3>
                    </div>
                    <div className="card">
                        <div className="imgCont">
                            <img src="/logos/PE-Small-Text-Logo.png" alt="blog photo" />
                            {/* <div className="overLay">
                                <FontAwesomeIcon icon={faCalendar} /> <time dateTime="2024-09-23T15:00">20-Sep-2024</time>
                            </div> */}
                        </div>
                        <h2>Coming Soon</h2>
                        <p>Coming Soon</p>
                        <h3>By PurEssence</h3>
                    </div>
                    <div className="card">
                        <div className="imgCont">
                            <img src="/logos/PE-Small-Text-Logo.png" alt="blog photo" />
                            {/* <div className="overLay">
                                <FontAwesomeIcon icon={faCalendar} /> <time dateTime="2024-09-23T15:00">20-Sep-2024</time>
                            </div> */}
                        </div>
                        <h2>Coming Soon</h2>
                        <p>Coming Soon</p>
                        <h3>By PurEssence</h3>
                    </div>
                </div>
                {/* <div className="moreBtn">
                    <button type="button">View More</button>
                </div> */}
            </div>
        </>
    )
}
