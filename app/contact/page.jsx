import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ContactPage() {
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
                            <textarea rows="5" placeholder="Msg" />
                            <button type="submit">Submit</button>
                        </form>
                        <div className="contactDetails">
                            <h2>Pur Essence Contact Details</h2>
                            <h3><strong>Company Name: </strong>Pur Essence LTD</h3>
                            <h3><strong>Address: </strong>Kings court 33 king street BB2 2DH</h3>
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
                                    <h3>Aaaaaaaaaaaaaaaaaaaaa, Obaidah will fill later</h3>
                                </div>
                                <div className="contactDetails">
                                    <h2>Nearest LandMarks to UK Head Office</h2>
                                    <h3>Bbbbbbbbbbbbbbbbbbbbbbbb, Obaidah will fill later</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}