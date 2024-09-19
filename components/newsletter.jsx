export default function NewsLetter() {
    return (
        <>
            <div className="letterCont">
                <div className="text">
                    <h1>Join Our Newsletter</h1>
                    <p>Be the first who will know our latest product, popular stock, and big discount</p>
                </div>
                <div className="inputCont">
                    <input type="email" id="newsEmail" placeholder="Enter Your Email..."/>
                    <button type="button">Join Now</button>
                </div>
            </div>
        </>
    )
}