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
                    <div className="reviewCard">
                        <img src="/CircleLogo.webp" alt="Logo" />
                        <h2>Carl Needspyce</h2>
                        <p>Testimonials are short quotes from people who love your brand. It&apos;s a great way to convince customers to try your products.</p>
                        <div className="stars">
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                        </div>
                    </div>
                    <div className="reviewCard">
                        <img src="/CircleLogo.webp" alt="Logo" />
                        <h2>Rosie Flavieur</h2>
                        <p>Testimonials are short quotes from people who love your brand. It&apos;s a great way to convince customers to try your products.</p>
                        <div className="stars">
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                            <FontAwesomeIcon style={{ color: '#dfb434' }} icon={faStar} />
                        </div>
                    </div>
                    <div className="reviewCard">
                        <img src="/CircleLogo.webp" alt="Logo" />
                        <h2>Rosie Flavieur</h2>
                        <p>Testimonials are short quotes from people who love your brand. It&apos;s a great way to convince customers to try your products.</p>
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