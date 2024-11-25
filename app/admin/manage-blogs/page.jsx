"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAdminContext } from "../adminContext";

export default function ManageBlogs() {
    const [blogs, setBlogs] = useState([])
    const router = useRouter()
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
    const { isAuthUser } = useAdminContext()
    useEffect(() => {
        if (!isAuthUser) router.push('/admin/authenticate')
    }, [isAuthUser])
    return (
        <div className="adminRoute">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / Manage Blogs</p>
                </div>
                <h1>Manage Blogs & Guides</h1>
                <button onClick={() => router.push('/admin/manage-blogs/blog')} className="btn addNew" type="button">Publish New Blog</button>
                <div className="tableCont">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '20px', whiteSpace: 'nowrap' }}> <input type="checkbox" checked={isChecked} onChange={handleInputState} name="" id="" /> Index</th>
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
                                        <td>{new Date(blog.date).toDateString()} {new Date(blog.date).toLocaleTimeString()}</td>
                                        <td>{blog.bAuthor}</td>
                                        <td style={{ justifyContent: 'center' }} className="tableFlex">
                                            <Link href={`/admin/manage-blogs/blog?bId=${blog.id}`}><img title="Edit Blog" className="actionIcon" src="/iconImgs/edit.webp" alt="Edit Icon" width={25} /></Link>
                                            <img onClick={() => handleDelete(blog.id)} title="Delete Blog" className="actionIcon" src="/iconImgs/delete.webp" alt="Delete Icon" width={25} />
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