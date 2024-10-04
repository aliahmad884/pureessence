"use client"
import FallBackLoader from "@/components/loader";
import { useEffect, useState } from "react"

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(false)
    }, [])
    if (isLoading) return <FallBackLoader />
    return (
        <>
            <div className="contactMainCont">
                <h1>Contact Us</h1>
                <div className="contactSubCont">
                    <div className="contactUs">
                        <form>
                            <input type="text" autoComplete="name" placeholder="Full Name" />
                            <div className="subInputCont">
                                <input type="email" autoComplete="email" placeholder="Email" />
                                <input type="tel" autoComplete="phone" placeholder="Phone" />
                            </div>
                            <textarea rows="7" placeholder="Message" />
                            <button type="submit">Submit</button>
                        </form>
                        <div className="contactDetails">
                            <h2>PUREssence Contact Details</h2>
                            <h3><strong>Company Name: </strong>Pure Essence LTD</h3>
                            <h3><strong>Address: </strong>Kings Court 33 King Street, Blackburn, UK, BB2 2DH</h3>
                            <h3><strong>Phone Number: </strong>(+44) 01254 411076</h3>
                            <h3><strong>Email Address: </strong>info@puressenceltd.co.uk</h3>
                            <div className="socialIcon">
                                <a href="#"><img src="twitter.webp" alt="Twitter" /></a>
                                <a href="#"><img src="facebook.webp" alt="Facebook" /></a>
                                <a href="#"><img src="whatsappB.webp" alt="WhatsApp" /></a>
                            </div>
                        </div>
                    </div>
                    <div className="departmentCont">
                        <h2>Department Contacts</h2>
                        <div className="departSubCont">
                            <div className="contactDetails">
                                <h2>General Business Department</h2>
                                <h3><strong>Department Lead: </strong> Mr Hashaam Naseer</h3>
                                <h3><strong>Phone Number: </strong>01254 411076</h3>
                                <h3><strong>Email Address: </strong>hashaam@puressenceltd.co.uk</h3>
                            </div>
                            <div className="contactDetails">
                                <h2> Administration Department</h2>
                                <h3><strong>Department Lead: </strong> Administrator</h3>
                                <h3><strong>Phone Number: </strong>01254 411076</h3>
                                <h3><strong>Email Address: </strong>info@puressenceltd.co.uk</h3>
                            </div>
                        </div>
                    </div>
                    <div className="contactLocation">
                        <h2>Contact Locations</h2>
                        <div className="contSubCo">
                            <div className="gLocation">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2359.4198054351964!2d-2.4888201229932414!3d53.746407544714245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487b9fcfd55ec24f%3A0x78b6a1ac01cf0be5!2sKings%20Court%2C%2033%20King%20St%2C%20Blackburn%20BB2%202DH%2C%20UK!5e0!3m2!1sen!2s!4v1727896891137!5m2!1sen!2s" style={{ width: '100%' }} height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                            <div className="officesCont">
                                <div className="contactDetails">
                                    <h2>Directions to UK Head Office</h2>
                                    <h3><b>By Car</b></h3>
                                    <li>From A666 (Bolton Road) from the South: Head northeast on Bolton Rd/A666 toward Chadwick St for 0.3 miles</li>
                                    <li>Continue onto Great Bolton St/A6078 for 0.1 miles</li>
                                    <li>Continue straight onto Great Bolton St for 174 ft</li>
                                    <li>Keep left to continue on Darwen St for 0.1 miles</li>
                                    <li>Continue onto Mincing Ln for 0.1 miles</li>
                                    <li>Turn left onto Clayton St for 423 ft</li>
                                    <li>Turn right onto Old Bank St, the destination will be on the left</li>
                                    <h3><b>By Train</b></h3>
                                    <li>From the train station, head southwest on Railway Rd toward Bridge St for 236ft</li>
                                    <li>Turn right toward Jubilee St for 56ft</li>
                                    <li>Turn left onto Jubilee St for 390ft</li>
                                    <li>Continue onto Mill Ln for 233ft</li>
                                    <li>Continue onto Mincing Ln for  374ft</li>
                                    <li>Turn left onto CLayton Street for 423 ft</li>
                                    <li>Turn right onto Old Bank St, the destination will be on the left</li>                                </div>
                                <div className="contactDetails">
                                    <h2>Nearest Landmarks to UK Head Office</h2>
                                    <h3><b>Regional Area</b></h3>
                                    <li>Borough: Blackburn with Darwen</li>
                                    <li>County: Lancashire</li>
                                    <li>Country Region: North West, England, United Kingdom</li>
                                    <h3><b>Notable Landmarks</b></h3>
                                    <li>Blackburn Cathedral: A historic cathedral located 2 minutes away by car and 5 minutes away on foot </li>
                                    <li>The Mall Blackburn: The town&apos;s main shopping centre located 7 minutes away by car and also 7 minutes away on foot</li>
                                    <li>Nearest Airport: Manchester Airport is the nearest airport located in Manchester about 40 miles away</li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}