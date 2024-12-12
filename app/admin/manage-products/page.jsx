"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAdminContext } from "../adminContext";
import { BlindsFallBack } from "@/components/loader";

export default function ManageProducts() {
    const [products, setProducts] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { isAuthUser } = useAdminContext()
    const [isAuthe, setIsAuth] = useState(true)
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
    const handleInputState = (event) => {
        setIsChecked(event.target.checked)
        // if (isChecked) alert('input checked')
        // else alert('input not checked')
    }
    useEffect(() => {
        fetch('/api/product').then(res => res.json()).then(result => {
            setProducts(result)
        }).catch(err => console.error(err))
    }, [])

    useEffect(() => {
        if (!isAuthUser) router.push(`/admin/authenticate?path=${pathname}`);
        else setIsAuth(false);
    }, [isAuthUser])
    if (isAuthe) return <BlindsFallBack />
    return (
        <div className="adminRoute">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / Manage Products</p>
                </div>
                <h1>Manage Products</h1>
                <button onClick={() => router.push('/admin/manage-products/product')} className="btn addNew" type="button"><i className="fi fi-sr-add"></i> Add Product</button>
                <div className="tableCont">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '20px', whiteSpace: 'nowrap' }}> <input type="checkbox" checked={isChecked} onChange={handleInputState} name="" id="" />&nbsp; Ind.</th>
                                <th>Product</th>
                                <th>Status</th>
                                <th>Price</th>
                                <th>View</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map((p, i) => (
                                    <tr key={p.id}>
                                        <td><input type="checkbox" checked={isChecked} name="" id="" /> &nbsp;&nbsp; {i + 1}</td>
                                        <td >
                                            <div className="tableFlex">
                                                <img src={`/api/uploadImg?path=${encodeURIComponent(p.pImages[0])}`} alt={p.pName} width={50} />
                                                <p>{p.pName}</p>
                                            </div>
                                        </td>
                                        <td><strong style={(p.status==='out of stock')?{color:'red'}:{color:'green'}}>{p.status}</strong></td>
                                        <td>&pound;{p.price}</td>
                                        <td><Link style={{ color: '#006BFF' }} href={`/products/${p.slug}`} target="_blank">{`/products/${p.slug}`}</Link></td>
                                        <td style={{ justifyContent: 'center' }} className="tableFlex">
                                            <Link href={`/admin/manage-products/product?pId=${p.id}`}>
                                                <i title="Edit Product" className="fi fi-sr-pencil"></i>
                                            </Link>
                                            <i style={{ cursor: 'pointer', color: 'red' }} className="fi fi-rr-trash-empty" onClick={() => handleDelete(p.id)} title="Delete Product"></i>
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