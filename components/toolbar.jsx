"use client"
import { useDataContext } from "@/context";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

export default function ToolBar() {
    const { innerWidth, setInnerWidth } = useDataContext()
    useEffect(() => {
        if (window.innerWidth <= 600) {
            setInnerWidth(window.innerWidth)
        }
    }, [])
    return (
        <>
            <div className="toolBarCont">
                <div className="contact">
                    <a href="tel:+441254411076">
                        {(innerWidth <= 780) ? (<><strong style={{ color: '#dfb434' }}><FontAwesomeIcon icon={faPhone} /></strong></>) : (
                            <><strong style={{ color: '#dfb434' }}><FontAwesomeIcon icon={faPhone} /></strong> +44 (0) 1254 411076</>
                        )}</a>
                    <a href="mailto:enquires@pureessenceltd.co.uk">
                        {(innerWidth <= 780) ? (<><strong style={{ color: '#dfb434' }}><FontAwesomeIcon icon={faEnvelope} /></strong></>) : (
                            <><strong style={{ color: '#dfb434' }}><FontAwesomeIcon icon={faEnvelope} /></strong> enquires@pureessenceltd.co.uk</>
                        )}</a>
                </div>
                {/* <div className="promo"> */}
                    <p>Keep and eye out for Promo Codes!</p>
                {/* </div> */}
            </div>
        </>
    )
}