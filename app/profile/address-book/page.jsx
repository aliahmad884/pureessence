"use client"

import AddressModal from "@/components/addressModal"
import FallBackLoader from "@/components/loader"
import PreviewModal from "@/components/previewMOdal"
import ProfileSidePanel from "@/components/profileSidePanel"
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
    const [isLoading, setIsloading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [selectedFIle, setSelectedFile] = useState('')

    useEffect(() => {
        let user = localStorage.getItem('user')
        if (!user) {
            router.push('/login?retTo=/profile')
        }
        setTimeout(()=>setIsloading(false),500)
        if (showModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => (document.body.style.overflow = 'auto');
    }, [showModal, loggedUser])
    if (!loggedUser||isLoading) {
        return <FallBackLoader />
    }
    return (
        <>
            <div className="proMainCont">
                <ProfileSidePanel />
                <div className="rightPanel">
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

                </div>
            </div>
        </>
    )
}