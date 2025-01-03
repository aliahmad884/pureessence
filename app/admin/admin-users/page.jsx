"use client"
import { useEffect, useState } from "react"
import { useAdminContext } from "../adminContext"
import { usePathname, useRouter } from "next/navigation"
import { BlindsFallBack } from "@/components/loader"
import Link from "next/link"

export default function RegisteredUsers() {
    const { isAuthUser } = useAdminContext()
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthe, setIsAuth] = useState(true)
    const [users, setUsers] = useState([])
    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/adminAuth');
            if (res.ok) {
                const result = await res.json()
                setUsers(result)
            }
            return;
        }
        catch (err) {
            console.error(err)
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [])
    useEffect(() => {
        if (!isAuthUser) router.push(`/admin/authenticate?path=${pathname}`);
        else setIsAuth(false);
    }, [isAuthUser]);
    if (isAuthe) return <BlindsFallBack />
    return (
        <div className="adminRoute">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / Admin Users</p>
                </div>
                <h1>Admin Users</h1>
                <div className="tableCont">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '20px', whiteSpace: 'nowrap' }}>&nbsp; Ind.</th>
                                <th>Userame</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users &&
                                users.map((data, i) => (
                                    <tr key={data.id}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td>{data.username}</td>
                                        <td>{data.email}</td>
                                        <td>{data.phone?data.phone:'Null'}</td>
                                        <td>{data.userRole}</td>
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