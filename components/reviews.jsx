"use client"
import React from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Slider from "react-slick";
// import ReviewCard from "./cards";

export default function Reviews() {
    return (
        <>
            <div className="reviewCont">
                <h1>Customer Reviews</h1>
                <div className="reviewCardCont">
                    <div className="reviewCard">
                        <img loading="lazy"  src="/CircleLogo.webp" alt="Logo" />
                        <h2>Genuine Reviews</h2>
                        <p>We promise to only show genuine verified reviews.</p>
                        <div className="stars">
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                        </div>
                    </div>
                    <div className="reviewCard">
                        <img loading="lazy"  src="/CircleLogo.webp" alt="Logo" />
                        <h2>You (Hopefully)</h2>
                        <p>We hope you will try out our products, and leave a review here!</p>
                        <div className="stars">
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}