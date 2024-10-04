export default function NewsLetter() {
    return (
        <>
            <div className="letterCont">
                <div className="text">
                    <h1>Join Our Value Newsletter</h1>
                    <p>Discounts, health guides and more! All without spam or annoying frequent emails. Unsubscribe anytime.</p>
                </div>
                <div className="inputCont">
                    <input type="email" id="newsEmail" placeholder="Enter Your Email..."/>
                    <button type="button">Join Now</button>
                </div>
            </div>
        </>
    )
}