"use client"
import { useEffect, useState } from "react"
import { useAdminContext } from "../adminContext"
import { usePathname, useRouter } from "next/navigation"
import { BlindsFallBack } from "@/components/loader"
import Link from "next/link"

export default function RegisteredUsers() {
    const { isAuthUser } = useAdminContext();
    const router = useRouter();
    const pathname = usePathname();
    const [userData, setUserData] = useState([]);
    const [isAuthe, setIsAuth] = useState(true);
    const fetchUsers = async () => {
        const res = await fetch('/api/user');
        if (res.ok) {
            const result = await res.json();
            // console.log(result)
            setUserData(result)
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
                    <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / Registered Users</p>
                </div>
                <h1>Registered Users</h1>
                <div className="tableCont">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '20px', whiteSpace: 'nowrap' }}>&nbsp; Ind.</th>
                                <th>Name</th>
                                <th>Email</th>
                                {/* <th>Phone</th> */}
                                <th>Reg.Date</th>
                                <th>Last Login</th>
                                <th>Registration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userData.map((data, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td>{data.FirstName} {data.LastName}</td>
                                        <td>{data.Email}</td>
                                        {/* <td>+92 322 8090884</td> */}
                                        <td>{new Date(data.RegDate).toDateString()} at {new Date(data.RegDate).toLocaleTimeString()}</td>
                                        <td>{new Date(data.LastLogin).toDateString()} at {new Date(data.LastLogin).toLocaleTimeString()}</td>
                                        <td>{data.AuthMethod}</td>
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