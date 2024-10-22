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
        setTimeout(() => setIsloading(false), 500)

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
                                    <td data-label={'Product'}><img loading="lazy" src="/shilajit.webp" width={50} /></td>
                                    <td colSpan={2} data-label={'Name'}>Shilajit Pure Himalian</td>
                                    <td colSpan={2} data-label={'Order Number'}>#45687418718974174</td>
                                    <td data-label={'Status'}>Returned</td>
                                    <td data-label={'Refund Status'}>Refund Pending</td>
                                </tr>
                                <tr>
                                    <td data-label={'Product'}><img loading="lazy" src="/shilajit.webp" width={50} /></td>
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