"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAdminContext } from "../adminContext"

export default function AdminNav() {
    const { setIsToggled } = useAdminContext()
    const pathName = usePathname()
    const toggler = () => {
        let nav = document.querySelector('.adminNavCont')
        nav.classList.remove('toggleNav')
        setIsToggled(false)
    }
    return (
        <>
            <div className="adminNavCont" style={pathName.startsWith('/admin/authenticate') ? { display: 'none' } : null}>
                <div className="adminLogo">
                    <Link onClick={toggler} href={'/admin'}><img src="/logos/PE-Main-Logo.png" alt="Logo" /></Link>
                    <div className="badge">Admin</div>
                </div>
                <div className="adminNavLinks">
                    <p>General</p>
                    <Link onClick={toggler} className={(pathName === '/admin') ? 'activeTab' : null} href={'/admin'}>
                        <i className="fi fi-sr-chart-histogram"></i>Dashboard</Link>
                    <Link onClick={toggler} className={(pathName === '/admin/manage-products') ? 'activeTab' : null} href={'/admin/manage-products'}>
                        <i className="fi fi-sr-dolly-flatbed-alt"></i>Manage Products</Link>
                    <Link onClick={toggler} className={(pathName === '/admin/manage-blogs') ? 'activeTab' : null} href={'/admin/manage-blogs'}>
                        <i className="fi fi-sr-blog-pencil"></i>Manage Blogs</Link>
                    <Link onClick={toggler} className={(pathName === '/admin/orders') ? 'activeTab' : null} href={'/admin/orders'}>
                        <i className="fi fi-sr-apps-sort"></i>Orders</Link>
                    <br />
                    <hr />
                    <br />
                    <p>Admin related</p>
                    <Link onClick={toggler} className={(pathName === '/admin/settings') ? 'activeTab' : null} href={'/admin/settings'}>
                        <i className="fi fi-sr-settings"></i>Settings</Link>
                    <Link onClick={toggler} className={(pathName === '/admin/registered-users') ? 'activeTab' : null} href={'/admin/registered-users'}>
                        <i className="fi fi-sr-users-alt"></i>Registered Users</Link>
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