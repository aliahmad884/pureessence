export default function AddressModal({ close }) {
    return (
        <>
            <div className="modalMainCont">
                <h1>Add New Address</h1>
                {/* <div className="modalSubCont"> */}
                <div className="leftForm">
                    <input type="text" required placeholder="Country" />
                    <input type="text" required placeholder="City" />
                </div>
                <div className="rightForm">
                    <input type="text" required placeholder="Full Name" />
                    <input type="tel" required placeholder="Phone Number" />
                    <input type="text" required placeholder="Address" />
                </div>
                <button style={{backgroundColor:'#dfb434'}} type="button">Save</button>
                <button onClick={close} type="button">Close</button>
            </div>
        </>
    )
}