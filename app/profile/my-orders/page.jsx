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
    const [isLoading, setIsloading] = useState(false)
    const [orderData, setOrderData] = useState([])

    useEffect(() => {
        setIsloading(true)
        let user = localStorage.getItem('user')
        if (!user) {
            router.push('/login?retTo=/profile')
        }
        fetch(`/api/order?orderStatus=Successfull&&user=${loggedUser ? loggedUser.Email : 'guest'}`).then(res => res.json()).then(result => {
            setOrderData(result.data)
            setTimeout(() => setIsloading(false), 500)
        }).catch(err => {
            console.error(err)
            setIsloading(false)
        })

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
                    {/* <ChildLoader/> */}
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
                                                        data.product.map((p) => <img loading="lazy" key={`${data.id}-${p.id}-img`} src={p.imgUrl} width={50} />)
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
                </div>
            </div>
        </>
    )
}