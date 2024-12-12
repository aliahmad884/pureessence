"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAdminContext } from "../adminContext";
import { BlindsFallBack } from "@/components/loader";

export default function ManageBlogs() {
    const [blogs, setBlogs] = useState([])
    const { isAuthUser } = useAdminContext()
    const [isAuthe, setIsAuth] = useState(true)
    const router = useRouter()
    const pathname = usePathname()
    const [isChecked, setIsChecked] = useState(false)
    const handleDelete = async (id) => {
        let found = blogs.filter(b => b.id !== id)
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
            setBlogs(found)
            let res = await fetch(`/api/blog?id=${id}`, { method: 'delete' })
            let result = await res.json()
            console.log(result)
            Swal.fire({
                title: "Deleted!",
                text: "The blog has been deleted.",
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
        fetch('/api/blog').then(res => res.json()).then(result => {
            setBlogs(result)
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
                    <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / Manage Blogs</p>
                </div>
                <h1>Manage Blogs & Guides</h1>
                <button onClick={() => router.push('/admin/manage-blogs/blog')} className="btn addNew" type="button"><i className="fi fi-sr-blog-pencil"></i> New Blog</button>
                <div className="tableCont">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '20px', whiteSpace: 'nowrap' }}> <input type="checkbox" checked={isChecked} onChange={handleInputState} name="" id="" />&nbsp; Ind.</th>
                                <th>Title</th>
                                <th>View</th>
                                <th>Category</th>
                                <th>Published On</th>
                                <th>Author</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                blogs && blogs.map((blog, index) => (
                                    <tr key={blog.id}>
                                        <td><input type="checkbox" checked={isChecked} name="" id="" /> &nbsp;&nbsp; {index + 1}</td>
                                        <td >
                                            <div className="tableFlex">
                                                <img src={`/api/uploadImg?path=${encodeURIComponent(blog.bTitleImg)}`} alt={blog.bTitle} width={50} />
                                                <p>{blog.bTitle}</p>
                                            </div>
                                        </td>
                                        <td><Link style={{ color: '#006BFF' }} href={blog.bCategory === 'Blog' ? `/blogs/${blog.bSlug}` : `/blogs/health-guides/${blog.bSlug}`} target="_blank">{blog.bCategory === 'Blog' ? `/blogs/${blog.bSlug}` : `/blogs/health-guides/${blog.bSlug}`}</Link></td>
                                        <td>{blog.bCategory}</td>
                                        <td>{new Date(blog.date).toDateString()}</td>
                                        <td>{blog.bAuthor}</td>
                                        <td style={{ justifyContent: 'center' }} className="tableFlex">
                                            <Link href={`/admin/manage-blogs/blog?bId=${blog.id}`}><i title="Edit Blog" className="fi fi-sr-pencil"></i></Link>
                                            <i style={{cursor:'pointer' ,color:'red'}} className="fi fi-rr-trash-empty" onClick={() => handleDelete(blog.id)} title="Delete Blog"></i>
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