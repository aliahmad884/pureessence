"use client"
import FallBackLoader from "@/components/loader";
import Link from "next/link";
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [mailBody, setMailBody] = useState({
        fullName: '',
        email: '',
        tel: '',
        msg: ''
    })

    const handleForm = (event) => {
        event.preventDefault();
        let body = mailBody
        setIsSending(true)
        fetch('/api/sendMail', {
            method: 'post',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(body)
        }).then(res => res.json()).then(result => {
            console.log(result)
            toast.success('Form Sent Successfully!')
            setIsSending(false)
        }).catch(err => {
            console.log(err)
            toast.error('Something went wrong, try again later')
        })
        setMailBody({
            fullName: '',
            email: '',
            tel: '',
            msg: ''
        })
    }

    useEffect(() => {
        setIsLoading(false)
    }, [])
    if (isLoading) return <FallBackLoader />
    return (
        <>
            <Toaster />
            <div className="contactMainCont">
                <h1>Contact Us</h1>
                <div className="contactSubCont">
                    <div className="contactUs">
                        <form onSubmit={handleForm}>
                            <input value={mailBody.fullName} onChange={(e) => setMailBody({ ...mailBody, fullName: e.target.value })} type="text" autoComplete="name" placeholder="Full Name" />
                            <div className="subInputCont">
                                <input value={mailBody.email} onChange={(e) => setMailBody({ ...mailBody, email: e.target.value })} type="email" autoComplete="email" placeholder="Email" />
                                <input value={mailBody.tel} onChange={(e) => setMailBody({ ...mailBody, tel: e.target.value })} type="tel" autoComplete="phone" placeholder="Phone" />
                            </div>
                            <textarea value={mailBody.msg} onChange={(e) => setMailBody({ ...mailBody, msg: e.target.value })} rows="7" placeholder="Message" />
                            <button type="submit">{isSending ? 'Please Wait...' : 'Submit'}</button>
                        </form>
                        <div className="contactDetails">
                            <h2>PurEssence Contact Details</h2>
                            <h3><strong>Company Name: </strong>PurEssence LTD</h3>
                            <h3><strong>Address: </strong>Kings Court 33 King Street, Blackburn, UK, BB2 2DH</h3>
                            <h3><strong>Phone Number: </strong>(+44) 01254 411076</h3>
                            <h3><strong>Email Address: </strong>info@puressenceltd.co.uk</h3>
                            <div className="socialIcon">
                                <a href="#"><img src="twitter.webp" alt="Twitter" /></a>
                                <a href="#"><img src="facebook.webp" alt="Facebook" /></a>
                                <a href="#"><img src="whatsapp.webp" alt="WhatsApp" /></a>
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
                                    <li>Turn left onto Clayton Street for 423 ft</li>
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
                        <div className="departmentCont">
                            <h2>Contact Guide</h2>
                            <div className="departSubCont">
                                <div className="contactDetails">
                                    <h2>Why to Contact Us?</h2>
                                    <li>If you need help selecting the right natural products or supplements</li>
                                    <li>For any inquiries regarding your order status, shipping, or delivery</li>
                                    <li>If you experience any issues with a product or delivery</li>
                                    <li>When you need clarification on how to use our products or understand their benefits</li>
                                    <li>For any other general questions or feedback</li>
                                </div>
                                <div className="contactDetails">
                                    <h2> When to Contact Us?</h2>
                                    <p>You may contact us during business hours. Expect to hear from us in an hour on average. <br /><br />You can also contact us on weekends, we may reply on the same day, though our guarentee is on the next working day.</p>
                                </div>
                                <div className="contactDetails">
                                    <h2> Visit Our FAQs</h2>
                                    <p>Please visit our FAQ Page for answers to common questions.</p><br />
                                    <Link href='/frequently-asked-questions'><p style={{ textAlign: 'center' }}>Visit FAQ Page ↗️</p></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}