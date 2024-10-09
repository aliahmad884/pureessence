"use client"

import AddressModal from "@/components/addressModal"
import FallBackLoader from "@/components/loader"
import PreviewModal from "@/components/previewMOdal"
import { useDataContext } from "@/context"
import { faEllipsisVertical, faGreaterThan, faGripVertical } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function Profile() {
    const router = useRouter()
    const { loggedUser } = useDataContext()
    const [isClicked, setIsClicked] = useState(false)
    const [isDomLoaded, setIsDomLoaded] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [selectedFIle, setSelectedFile] = useState('')
    const [orderData, setOrderData] = useState([])
    const [orderStatus, setOrderStatus] = useState('Successfull')
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
        let panel = document.querySelector('.sidePanel')
        let icon = document.querySelector('.toggleIcon')
        tabs.forEach((ele, i) => {
            ele.style.display = 'none'
            list[i].removeAttribute('style')
            if (ele.dataset.value === tab) {
                list[i].style.color = '#dfb434'
                list[i].style.fontWeight = 'bold'
                ele.style.display = 'flex'
                panel.classList.remove('toggle')
                icon.removeAttribute('style')
            }
        })
    }
    useEffect(() => {
        let user = localStorage.getItem('user')
        if (!user) {
            setTimeout(() => router.push('/login?retTo=/profile'), 1500)
        }
        setIsDomLoaded(true)
        if (showModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        fetch(`/api/order?orderStatus=${orderStatus}&&user=${loggedUser ? loggedUser.Email : 'guest'}`).then(res => res.json()).then(result => {
            setOrderData(result.data)
        }).catch(err => console.error(err))

        return () => (document.body.style.overflow = 'auto');
    }, [showModal, orderStatus, loggedUser])
    if (!loggedUser) {
        return <FallBackLoader />
    }
    return (
        <>
            <div className="proMainCont">
                <div className="sidePanel">
                    <div onClick={handleSidePanel} className="toggleIcon"><FontAwesomeIcon icon={faGripVertical} /></div>
                    <div className="proImgCont">
                        <img loading="lazy"  src="/avatar2.webp" alt="Avatar" />
                        <h1>{loggedUser ? loggedUser.Name : 'Guest User'}</h1>
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
                            <li onClick={() => { tabHandler('myOrders'), setOrderStatus('Successfull') }} data-value={'myOrders'}>My Orders</li>
                            <li onClick={() => { tabHandler('myCancel'), setOrderStatus('Cancelled') }} data-value={'myCancel'}>My Cancellations</li>
                            <li onClick={() => { tabHandler('myReturn'), setOrderStatus('Returned') }} data-value={'myReturn'}>My Returns</li>
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
                        <div className="fileCont">
                            <div style={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
                                <label htmlFor="file">Profile Picture</label>
                                <input onChange={(e) => {
                                    setSelectedFile(e.target.files[0])
                                    setShowPreview(true)
                                }} type="file" id="file" />
                                {/* {showPreview && createPortal(<PreviewModal path={selectedFIle} />, document.body)} */}
                            </div>
                            <div className="btnCont">
                                <button style={{ backgroundColor: 'white' }} type="button">Edit</button>
                            </div>
                        </div>
                        <button className="saveBtn" type="button">Save</button>
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
                                <tr>
                                    <td data-label={'Full Name'}>Usman Ahmad</td>
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
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th colSpan={2}>Name</th>
                                    <th colSpan={2}>Order Number</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orderData && orderData.map((data, index) => (
                                        <tr key={data.id}>
                                            <td data-label={'Product'}>
                                                <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'space-evenly' }}>
                                                    {
                                                        data.product.map((p) => <img loading="lazy"  key={`${data.id}-${p.id}-img`} src={p.imgUrl} width={50} />)
                                                    }
                                                </div>
                                            </td>
                                            <td colSpan={2} data-label={'Name'}>
                                                <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'space-between' }}>
                                                    {
                                                        data.product.map((p) => <p key={`${data.id}-${p.id}-title`} style={{ margin: '5px 0' }}>{p.title}</p>)
                                                    }
                                                </div>
                                            </td>
                                            <td colSpan={2} data-label={'Order Number'}>#{data.id}</td>
                                            <td data-label={'Status'}>{data.orderStatus}</td>
                                            <td data-label={'Action'}><Link href={`/orderManage?orderNumber=${data.id}&YewAR948679=AEW86`}>Manage Order</Link></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="myCancel tab" data-value={'myCancel'}>
                        <h1>My Cancellations</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th colSpan={2}>Name</th>
                                    <th colSpan={2}>Order Number</th>
                                    <th>Status</th>
                                    <th>Refund Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Shilajit Pure Himalian</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Cancelled</td>
                                    <td data-label={'Refund Status'}>Null</td>
                                </tr>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Black Seed Oil</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Cancelled</td>
                                    <td data-label={'Refund Status'}>Null</td>
                                </tr>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Shilajit Pure Himalian</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Cancelled</td>
                                    <td data-label={'Refund Status'}>Null</td>
                                </tr>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Black Seed Oil</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Cancelled</td>
                                    <td data-label={'Refund Status'}>Null</td>
                                </tr>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Shilajit Pure Himalian</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Cancelled</td>
                                    <td data-label={'Refund Status'}>Null</td>
                                </tr>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Black Seed Oil</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Cancelled</td>
                                    <td data-label={'Refund Status'}>Null</td>
                                </tr>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Shilajit Pure Himalian</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Cancelled</td>
                                    <td data-label={'Refund Status'}>Null</td>
                                </tr>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Black Seed Oil</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Cancelled</td>
                                    <td data-label={'Refund Status'}>Null</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="myReturn tab" data-value={'myReturn'}>
                        <h1>My Returns</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th colSpan={2}>Name</th>
                                    <th colSpan={2}>Order Number</th>
                                    <th>Status</th>
                                    <th>Refund Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Shilajit Pure Himalian</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Returned</td>
                                    <td data-label={'Refund Status'}>Refund Pending</td>
                                </tr>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy"  src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Black Seed Oil</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Returned</td>
                                    <td data-label={'Refund Status'}>Approved</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}