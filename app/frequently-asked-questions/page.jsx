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
                    <Accordion defaultActiveKey={1} style={{ padding: '0 10px' }}>
                        <Accordion.Panel className="accordPanel" classPrefix="temp" eventKey={1} header='Panel 1'>
                            <p style={{ textAlign: 'justify', paddingTop: '20px' }}>orem ipsum dolor, sit amet consectetur adipisicing elit. Tempore sed, expedita earum et dolorem modi suscipit laboriosam neque quidem enim praesentium velit fugit impedit laborum amet dolorum aspernatur quia? Cum.
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo dolorum recusandae impedit corporis obcaecati exercitationem ad esse nisi provident laborum ipsam autem, magni beatae tempore. Nisi corporis itaque doloribus perferendis.
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellendus velit assumenda, aliquid vel odit iusto voluptates at! Assumenda neque vitae, earum aspernatur tenetur rerum molestiae animi, maiores voluptatem quibusdam itaque?</p>
                        </Accordion.Panel>
                        <Accordion.Panel className="accordPanel" classPrefix="temp" header='Panel 1' eventKey={2}>
                            <p style={{ textAlign: 'justify', paddingTop: '20px' }}>orem ipsum dolor, sit amet consectetur adipisicing elit. Tempore sed, expedita earum et dolorem modi suscipit laboriosam neque quidem enim praesentium velit fugit impedit laborum amet dolorum aspernatur quia? Cum.
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo dolorum recusandae impedit corporis obcaecati exercitationem ad esse nisi provident laborum ipsam autem, magni beatae tempore. Nisi corporis itaque doloribus perferendis.
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellendus velit assumenda, aliquid vel odit iusto voluptates at! Assumenda neque vitae, earum aspernatur tenetur rerum molestiae animi, maiores voluptatem quibusdam itaque?</p>
                        </Accordion.Panel>
                        <Accordion.Panel className="accordPanel" classPrefix="temp" header='Panel 1' eventKey={3}>
                            <p style={{ textAlign: 'justify', paddingTop: '20px' }}>orem ipsum dolor, sit amet consectetur adipisicing elit. Tempore sed, expedita earum et dolorem modi suscipit laboriosam neque quidem enim praesentium velit fugit impedit laborum amet dolorum aspernatur quia? Cum.
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo dolorum recusandae impedit corporis obcaecati exercitationem ad esse nisi provident laborum ipsam autem, magni beatae tempore. Nisi corporis itaque doloribus perferendis.
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellendus velit assumenda, aliquid vel odit iusto voluptates at! Assumenda neque vitae, earum aspernatur tenetur rerum molestiae animi, maiores voluptatem quibusdam itaque?</p>
                        </Accordion.Panel>
                    </Accordion>
                    <div className='infoCont'>
                        <h4>For more info lorem</h4>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat dignissimos ea distinctio, dolores maiores rerum eum praesentium, facere aliquam cum eaque at et sapiente. Quam alias recusandae quis sequi rerum.lor Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae minus neque fugiat pariatur aperiam consequatur cum distinctio nostrum animi, corporis, labore ullam earum modi nam corrupti obcaecati quo quibusdam nihil.</p>
                    </div>
                </div>
            </div>
        </>
    )
}