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
            <div className="adminNavCont">
                <div className="adminLogo">
                    <Link onClick={toggler} href={'/admin'}><img src="/logos/PE-Main-Logo.png" alt="Logo" /></Link>
                    <div className="badge">Admin</div>
                </div>
                <div className="adminNavLinks">
                    <p>General</p>
                    <Link onClick={toggler} className={(pathName === '/admin') ? 'activeTab' : null} href={'/admin'}><img src="/iconImgs/dashboard1.webp" alt="Dash Icon" width={20} /> Dashboard</Link>
                    <Link onClick={toggler} className={(pathName === '/admin/manage-products') ? 'activeTab' : null} href={'/admin/manage-products'}><img src="/iconImgs/new-product.webp" alt="Product Icon" width={20} /> Manage Products</Link>
                    <Link onClick={toggler} className={(pathName === '/admin/manage-blogs') ? 'activeTab' : null} href={'/admin/manage-blogs'}><img src="/iconImgs/blog.webp" alt="Blog Icon" width={20} /> Manage Blogs</Link>
                    <Link onClick={toggler} className={(pathName === '/admin/registered-users') ? 'activeTab' : null} href={'/admin/registered-users'}><img src="/iconImgs/group.webp" alt="Users Icon" width={20} /> Registered Users</Link>
                    <br />
                    <hr />
                    <br />
                    <p>Admin related</p>
                    <Link onClick={toggler} className={(pathName === '/admin/settings') ? 'activeTab' : null} href={'/admin/settings'}><img src="/iconImgs/settings.webp" alt="Setting Icon" width={20} /> Settings</Link>
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