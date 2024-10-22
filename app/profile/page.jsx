"use client"


import FallBackLoader from "@/components/loader"
import ProfileSidePanel from "@/components/profileSidePanel"
import { useDataContext } from "@/context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Profile() {
    const router = useRouter()
    const { loggedUser } = useDataContext()
    const [isLoading, setIsloading] = useState(true)

    useEffect(() => {
        let user = localStorage.getItem('user')
        if (!user) {
            router.push('/login?retTo=/profile')
        }
        setTimeout(()=>setIsloading(false),500)

        return () => (document.body.style.overflow = 'auto');
    }, [loggedUser])
    if (!loggedUser || isLoading) {
        return <FallBackLoader />
    }
    return (
        <>
            <div className="proMainCont">
                <ProfileSidePanel />
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
                            </div>
                            <div className="btnCont">
                                <button style={{ backgroundColor: 'white' }} type="button">Edit</button>
                            </div>
                        </div>
                        <button className="saveBtn" type="button">Save</button>
                    </div>

                </div>
            </div>
        </>
    )
}