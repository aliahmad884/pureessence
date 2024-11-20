"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ManageProducts() {
    const [products, setProducts] = useState([])
    const router = useRouter()
    const handleDelete = async (id) => {
        let found = products.filter(p => p.id !== id)
        let result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: 'white',
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            allowOutsideClick: false
        })
        if (result.isConfirmed) {
            setProducts(found)
            let res = await fetch(`/api/product?id=${id}`, { method: 'delete' })
            let result = await res.json()
            console.log(result)
            Swal.fire({
                title: "Deleted!",
                text: "The product has been deleted.",
                icon: "success",
                confirmButtonColor: 'white',
            });
        }
    }
    useEffect(() => {
        fetch('/api/product').then(res => res.json()).then(result => {
            setProducts(result)
        }).catch(err => console.error(err))
    }, [])
    return (
        <div className="adminRoute">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link style={{textDecoration:'underline'}} href="/admin">Dashboard</Link> / Manage Products</p>
                </div>
                <h1>Manage Products</h1>
                <button onClick={() => router.push('/admin/manage-products/product')} className="btn addNew" type="button"><img src="/iconImgs/store.webp" alt="Store Icon" width={25} /> Add Product</button>
                <div className="tableCont">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '20px' }}>Index</th>
                                <th >Product</th>
                                <th>View</th>
                                <th>Price</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map((p, i) => (
                                    <tr key={p.id}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td >
                                            <div className="tableFlex">
                                                <img src={`/api/uploadImg?path=${encodeURIComponent(p.pImages[0])}`} alt={p.pName} width={50} />
                                                <p>{p.pName}</p>
                                            </div>
                                        </td>
                                        <td><Link style={{color:'#006BFF'}} href={`/products/${p.slug}`} target="_blank">{`/products/${p.slug}`}</Link></td>
                                        <td>&pound;{p.price}</td>
                                        <td style={{ justifyContent: 'center' }} className="tableFlex">
                                            <Link href={`/admin/manage-products/product?pId=${p.id}`}><img title="Edit Product" className="actionIcon" src="/iconImgs/edit.webp" alt="Edit Icon" width={25} /></Link>
                                            <img onClick={() => handleDelete(p.id)} title="Delete Product" className="actionIcon" src="/iconImgs/delete.webp" alt="Delete Icon" width={25} />
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