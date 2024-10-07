"use client"
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Placeholder } from "rsuite";
import { useEffect, useState } from 'react'
import FallBackLoader from "@/components/loader";


export default function FAQs() {
    const [isLoading, setIsloading] = useState(true)
    useEffect(() => {
        let headers = document.querySelectorAll('.rs-panel-btn')
        let headerCont = document.querySelectorAll('.rs-panel-header')
        headers.forEach((btn, i) => {
            headerCont[i].style.padding = '0'
            btn.style.backgroundColor = '#dfb434'
            btn.style.padding = '20px 20px'
            // btn.style.borderBottomLeftRadius = '0'
            // btn.style.borderBottomRightRadius = '0'
            // btn.style.marginBottom = '15px'
        })
        // setIsloading(false)
    }, [])
    // if (isLoading) return <FallBackLoader />
    return (
        <>
            <div className="faqsCont">
                <div className="accordCont">
                    <h1>FAQs</h1>
                    <h2>Accounts and Security</h2>
                    <Accordion defaultActiveKey={1} style={{ padding: '0 10px' }}>
                        <Accordion.Panel className="accordPanel" classPrefix="temp" eventKey={1} header='Can I make a purchase without logging in?'>
                            <p style={{ textAlign: 'justify', paddingTop: '20px' }}>Yes, you can make orders without logging in by calling us or by live chat on WhatsApp.</p>
                        </Accordion.Panel>
                        <Accordion.Panel className="accordPanel" classPrefix="temp" header='Do you save my card details?' eventKey={2}>
                            <p style={{ textAlign: 'justify', paddingTop: '20px' }}>Currently, we do not store card details. All data is only stored on your local device, such as your computer or mobile device.</p>
                        </Accordion.Panel>
                    </Accordion>
                    <div className='infoCont'>
                       <h4></h4>
                        <p></p>
                    </div>
                    <h2>Delivery</h2>
                    <Accordion defaultActiveKey={1} style={{ padding: '0 10px' }}>
                        <Accordion.Panel className="accordPanel" classPrefix="temp" eventKey={4} header='What are the delivery costs?'>
                            <p style={{ textAlign: 'justify', paddingTop: '20px' }}>Delivery costs, ranging from free to domestic and international are quoted based on location and order amount. Please contact us for more information.</p>
                        </Accordion.Panel>
                        <Accordion.Panel className="accordPanel" classPrefix="temp" header='How do I track my order?' eventKey={5}>
                            <p style={{ textAlign: 'justify', paddingTop: '20px' }}>You will be provided with a tracking code, which you can check with the delivery service.</p>
                        </Accordion.Panel>
                        <Accordion.Panel className="accordPanel" classPrefix="temp" header='What if my package was damaged during delivery?' eventKey={5}>
                            <p style={{ textAlign: 'justify', paddingTop: '20px' }}>In the case of mishap or damage during delviery, don't hesitate to take photos and a video.And please get into contact with us. Our products are well packaged, though we should always plan for errors.</p>
                        </Accordion.Panel>
                    </Accordion>
                    <div className='infoCont'>
                       <h4></h4>
                        <p></p>
                    </div>

                </div>
            </div>
        </>
    )
}