"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ManageProducts() {
    const router = useRouter()
    const data = [1, 2, 3, 4, 5, 6]
    return (
        <div className="adminRoute">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link href="/admin">Dashboard</Link> / Products</p>
                </div>
                <h1>Manage Products</h1>
                <button onClick={() => router.push('/admin/manage-products/new-product')} className="newProductBtn" type="button"><img src="/icons/store.webp" alt="Store Icon" width={25} /> New Product</button>
                <div className="tableCont">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '20px' }}>Index</th>
                                <th colSpan={2}>Product</th>
                                <th>Stock</th>
                                <th>Price</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map(index => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center' }}>{index}</td>
                                        <td colSpan={2}>
                                            <div className="tableFlex">
                                                <img src="/products/Acacia Pure Honey.webp" alt="Temp" width={50} />
                                                <p>Raw Honey</p>
                                            </div>
                                        </td>
                                        <td>18 in stock</td>
                                        <td>&pound;12.80</td>
                                        <td style={{ justifyContent: 'center' }} className="tableFlex">
                                            <img title="Edit Product" className="actionIcon" src="/icons/edit.webp" alt="Edit Icon" width={25} />
                                            <img title="Delete Product" className="actionIcon" src="/icons/delete.webp" alt="Delete Icon" width={25} />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}