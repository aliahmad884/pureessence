"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminNav() {
    const pathName = usePathname()
    return (
        <>
            <div className="adminNavCont">
                <div className="adminLogo">
                    <Link href={'/admin'}><img src="/logos/PE-Main-Logo.png" alt="Logo" /></Link>
                    <div className="badge">Admin</div>
                </div>
                <div className="adminNavLinks">
                    <p>General</p>
                    <Link className={(pathName === '/admin') ? 'activeTab' : null} href={'/admin'}><img src="/icons/dashboard.webp" alt="Dash Icon" width={20} /> Dashboard</Link>
                    <Link className={(pathName === '/admin/manage-products') ? 'activeTab' : null} href={'/admin/manage-products'}><img src="/icons/product.webp" alt="Product Icon" width={20} /> Manage Products</Link>
                    <Link className={(pathName === '/admin/manage-blogs') ? 'activeTab' : null} href={'/admin/manage-blogs'}><img src="/icons/blog.webp" alt="Blog Icon" width={20} /> Manage Blogs</Link>
                    <Link className={(pathName === '/admin/registered-users') ? 'activeTab' : null} href={'/admin/registered-users'}><img src="/icons/users.webp" alt="Users Icon" width={20} /> Registered Users</Link>
                    <br />
                    <hr />
                    <br />
                    <p>Admin related</p>
                    <Link className={(pathName === '/admin/settings') ? 'activeTab' : null} href={'/admin/settings'}><img src="/icons/settings.webp" alt="Setting Icon" width={20} /> Settings</Link>
                    <br />
                </div>
                <div className="adminCopR">
                    <img src="/logos/apanel.png" alt="Apanel Logo" />
                    {/* <p>Copyright &copy; <b>aPanel<strong style={{color:'#888888',fontSize:'0.8rem',fontWeight:'normal',fontStyle:'italic'}}>1.0.0</strong></b> All Rights Reserved |<br/> Designed & Developed by <strong><a style={{textDecoration:'underline'}} href="https://aldortech.vercel.app/">AldorTech LTD</a></strong></p> */}
                </div>
            </div>
        </>
    )
}