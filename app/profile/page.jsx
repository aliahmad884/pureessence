"use client"

import AddressModal from "@/components/addressModal"
import { faEllipsisVertical, faGreaterThan, faGripVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function Profile() {
    const [isClicked, setIsClicked] = useState(false)
    const [isDomLoaded, setIsDomLoaded] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const handleSidePanel = () => {
        let panel = document.querySelector('.sidePanel')
        let icon = document.querySelector('.toggleIcon')
        panel.classList.add('toggle')
        icon.style.display = 'none'
        // icon.classList.remove('show')
        setIsClicked(true)
    }
    if (isDomLoaded) {
        document.addEventListener('click', (event) => {
            let panel = document.querySelector('.sidePanel')
            let icon = document.querySelector('.toggleIcon')
            if (isClicked && panel && !panel.contains(event.target)) {
                panel.classList.remove('toggle')
                icon.removeAttribute('style')
                setIsClicked(false)
            }
        })
    }
    const tabHandler = (tab) => {
        const opt = document.querySelector('.optionsCont')
        const list = opt.querySelectorAll('li')
        const tabs = document.querySelectorAll('.tab')
        tabs.forEach((ele, i) => {
            ele.style.display = 'none'
            list[i].removeAttribute('style')
            if (ele.dataset.value === tab) {
                list[i].style.color = '#dfb434'
                list[i].style.fontWeight = 'bold'
                ele.style.display = 'flex'
            }
        })
    }
    useEffect(() => {
        setIsDomLoaded(true)
        if (showModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => (document.body.style.overflow = 'auto');
    }, [showModal])
    return (
        <>
            <div className="proMainCont">
                <div className="sidePanel">
                    <div onClick={handleSidePanel} className="toggleIcon"><FontAwesomeIcon icon={faGripVertical} /></div>
                    <div className="proImgCont">
                        <img src="/avatar2.webp" alt="Avatar" />
                        <h1>User Name</h1>
                    </div>
                    <div className="optionsCont">
                        <h2>Manage My Account</h2>
                        <ul>
                            <li style={{ color: '#dfb434', fontWeight: 'bold' }} onClick={() => tabHandler('editProfile')} data-value={'editProfile'}>Edit Profile</li>
                            <li onClick={() => tabHandler('addressBook')} data-value={'addressBook'}>Address Book</li>
                            {/* <li onClick={() => tabHandler('paymentOpt')} data-value={'paymentOpt'}>My Payment Options</li> */}
                        </ul>
                        <h2>My Orders</h2>
                        <ul>
                            <li onClick={() => tabHandler('myOrders')} data-value={'myOrders'}>My Orders</li>
                            <li onClick={() => tabHandler('myCancel')} data-value={'myCancel'}>My Cancellations</li>
                            <li onClick={() => tabHandler('myReturn')} data-value={'myReturn'}>My Returns</li>
                        </ul>
                    </div>
                </div>
                <div className="rightPanel">
                    <div style={{ display: 'flex' }} className="editCont tab" data-value={'editProfile'}>
                        <h1>Edit Profile</h1>
                        <div className="editSubCont">
                            <div className="nameCont">
                                <label htmlFor="firstName">First Name</label>
                                <input disabled={false} type="text" id="firstName" required placeholder="First Name" />
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" required placeholder="Last Name" />
                            </div>
                            <div className="emailCont">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" required placeholder="example@gmail.com" />
                                <label htmlFor="newPass">New Password</label>
                                <input type="password" id="newPass" required placeholder="new password" />
                            </div>
                        </div>
                        <div className="btnCont">
                            <button style={{ backgroundColor: 'white' }} type="button">Edit</button>
                            <button style={{ backgroundColor: '#dfb434' }} type="button">Save</button>
                        </div>
                    </div>
                    <div className="addressBook tab" data-value={'addressBook'}>
                        <h1>Adress Book</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Address</th>
                                    <th>Postcode</th>
                                    <th>Phone Number</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label={'Full Name'}>Ali Ahmad</td>
                                    <td data-label={'Address'}>Chunghi Amar Sidhu Lahore</td>
                                    <td data-label={'Postcode'}>Lahore-Punjab 54000</td>
                                    <td data-label={'Phone Number'}>+92 322 8090884</td>
                                    <td data-label={'Action'}>EDIT</td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="button" onClick={() => setShowModal(true)}>+ Add New Address</button>
                        {showModal && createPortal(<>
                            <div className="blurBg"></div>
                            <AddressModal close={() => setShowModal(false)} />
                        </>, document.body)}
                    </div>
                    {/* <div className="paymentOpt tab" data-value={'paymentOpt'}>
                        <h1>My Pyament Options</h1>
                    </div> */}
                    <div className="myOrders tab" data-value={'myOrders'}>
                        <h1>My Orders</h1>
                    </div>
                    <div className="myCancel tab" data-value={'myCancel'}>
                        <h1>My Cancellations</h1>
                    </div>
                    <div className="myReturn tab" data-value={'myReturn'}>
                        <h1>My Returns</h1>
                    </div>
                </div>
            </div>
        </>
    )
}