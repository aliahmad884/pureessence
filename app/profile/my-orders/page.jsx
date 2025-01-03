"use client"


import FallBackLoader from "@/components/loader"
import ProfileSidePanel from "@/components/profileSidePanel"
import { useDataContext } from "@/context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Profile() {
    const router = useRouter()
    // const { loggedUser } = useDataContext()
    const [isLoading, setIsloading] = useState(false)
    const [orderData, setOrderData] = useState([])

    useEffect(() => {
        document.title = 'Orders | PurEssence'
        setIsloading(true)
        // console.log(loggedUser)
        let user = localStorage.getItem('user')
        if (!user) {
            router.push('/login?retTo=/profile')
        }
        else {
            const loggedUser = JSON.parse(user)
            fetch(`/api/order?orderStatus=Processing&&user=${loggedUser.Email}`).then(res => res.json()).then(result => {
                setOrderData(result.data)
                setIsloading(false)
            }).catch(err => {
                console.error(err)
                setIsloading(false)
            })
        }
        return () => (document.body.style.overflow = 'auto');
    }, [])
    if (isLoading) {
        return <FallBackLoader />
    }
    else if (orderData.length == 0) {
        return (
            <div className="proMainCont">
                <ProfileSidePanel />
                <div className="rightPanel" style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem' }}>Place an order to see details.</h1>
                    <Link style={{ textDecoration: 'underline' }} href={'/products'}>Go to shopping</Link>
                </div>
            </div>
        )
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
                                    <th style={{ width: '50px' }}>Ind.</th>
                                    <th>Ord.Id</th>
                                    <th colSpan={2}>Date</th>
                                    <th>T.Amount</th>
                                    <th>Invoice</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orderData && orderData.map((data, index) => (
                                        <tr key={data.id}>
                                            <td data-label={'Index:'}>{index + 1}</td>
                                            <td data-label={'Ord.Id:'}>
                                                #{data.id}
                                                {/* <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'space-evenly' }}></div> */}
                                            </td>
                                            <td colSpan={2} data-label={'Date:'}>
                                                {new Date(data.orderDate).toDateString()}
                                                {/* <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'space-between' }}>
                                                    {
                                                        data.product.map((p) => <p key={`${data.id}-${p.id}-title`} style={{ margin: '5px 0' }}>{p.title}</p>)
                                                    }
                                                </div> */}
                                            </td>
                                            <td data-label={'T.Amount:'}>{data.totalAmount}</td>
                                            <td data-label={'Invoice:'}><Link style={{ color: 'blue' }} href={data.invLink} target="_blank">Inv</Link></td>
                                            {/* <td data-label={'Status'}>{data.orderStatus}</td> */}
                                            <td data-label={'Action:'}><Link href={`/orderManage?orderNumber=${data.id}`}>Manage Order</Link></td>
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