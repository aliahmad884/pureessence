export default function Hero() {
    return (
        <>
            <div className="heroContainer">
                <h1>The Purest<br /> Products, For a<br /> Better You.</h1>
                <button type="button">Shop Now</button>
            </div>
            <div className="aboutContainer">
                <div className="aboutText">
                    <h1>About the Brand</h1>
                    <p>There is nothing like fresh spice or the purest of ingredients for your daily diet or supplimentary intake</p>
                    <br />
                    <br />
                    <p>This is why the team behind Pure Essence recognised the need for international supplies of the highest quality of natural products.</p>
                    <br />
                    <br />
                    <p>The team come from a background of herbal practitioners and good ol' spice lovers, so rest assured Pure Essence provides the best quality and type of product for a better you.</p>
                </div>
                <div className="aboutImg">
                    <img src="/spices.webp" alt="Spices" />
                </div>
            </div>
            <div className="offerContainer">
                <h1>What We Offer</h1>
                <div className="imgCont">
                    <div className="cardCont">
                        <img src="/spices.webp" alt="Spices" />
                        <h2>Rich Spices</h2>
                        <p>Who said you can't eat till you are fit. Food is a pillar of health, you either keep it or ruin it.</p>
                    </div>
                    <div className="cardCont">
                        <img src="/spices.webp" alt="Spices" />
                        <h2>Fresh Suppliments</h2>
                        <p>Improve your health or recover from ailment, we source only the most natural products.</p>
                    </div>
                    <div className="cardCont">
                        <img src="/spices.webp" alt="Spices" />
                        <h2>Quality Health Foods</h2>
                        <p>Who said you can't eat till you are fit. Food is a pillar of health, you either keep it or ruin it.</p>
                    </div>
                    <div className="cardCont">
                        <img src="/spices.webp" alt="Spices" />
                        <h2>Fresh Suppliments</h2>
                        <p>Improve your health or recover from ailment, we source only the most natural products.</p>
                    </div>
                </div>
            </div>
        </>
    )
}