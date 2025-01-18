"use client"
import { useEffect, useState } from "react"
import { useAdminContext } from "../adminContext"
import { usePathname, useRouter } from "next/navigation"
import { BlindsFallBack } from "@/components/loader"
import Link from "next/link"
import Swal from "sweetalert2"

export default function RegisteredUsers() {
    const { isAuthUser, loggedUser } = useAdminContext()
    const router = useRouter()
    const pathname = usePathname()
    const [isEditable, setIsEditable] = useState(null)
    const [updatedRole, setUpdatedRole] = useState('User')
    const [isAuthe, setIsAuth] = useState(true)
    const [users, setUsers] = useState([])
    const handleSave = async (id) => {
        setUsers(prev =>
            prev.map(user => user.id === id ? { ...user, userRole: updatedRole || user.userRole } : user)
        )
        setIsEditable(null)
        try {
            const res = await fetch(`/api/adminAuth?action=updateRole&&userId=${id}&newRole=${updatedRole}`, { method: 'put' })
            if (res.ok) {
                const result = await res.json()
                Swal.fire({
                    icon: 'success',
                    title: 'Role update',
                    text: result.res
                })
                setUpdatedRole('');
            }
            else {
                const result = await res.json()
                console.log(result)
                alert('Having Error in updating Role!')
            }
        }
        catch (err) {
            console.log(err)
        }

    };
    const handleDiscard = () => {
        setIsEditable(null);
        setUpdatedRole('');
    };

    const fireModal = async () => {
        const { value: password } = await Swal.fire({
            title: 'Enter your password',
            input: 'password',
            inputLabel: 'Password',
            inputPlaceholder: 'Enter your password',
            inputAttributes: {
                maxlength: "10",
                autocapitalize: "off",
                autocorrect: "off"
            }
        })
        return password
    }
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
    const handleDelete = async (id) => {
        if (loggedUser.id === id) return null;
        const password = await fireModal()
        if (password) {
            try {
                const res = await fetch(`/api/adminAuth?action=checkPass&&userId=${loggedUser.id}&&userPass=${password}`)
                if (res.ok) {
                    // const result = await res.json()
                    const delUser = await fetch(`/api/adminAuth?action=deleteUser&&userId=${id}`, {
                        method: 'delete'
                    })
                    await fetchUsers()
                    if (delUser.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'User deleted successfully'
                        })
                    }
                    else alert('Having problem in deleting user!')
                }
                else {
                    alert('Incorrect password!')
                }
            }
            catch (err) {
                console.log(err)
            }
        }
    }
    const handleEditUser = async (id) => {
        setIsEditable(id)
        // if (loggedUser.id === id) return null;
        // const password = await fireModal()
        // if (password) {
        //     try {
        //         const res = await fetch(`/api/adminAuth?action=checkPass&&userId=${loggedUser.id}&&userPass=${password}`)
        //         if (res.ok) {
        //             const result = await res.json()
        //             alert(result.res)
        //         }
        //         else {
        //             alert('Incorrect password!')
        //         }
        //     }
        //     catch (err) {
        //         console.log(err)
        //     }
        // }
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
                                <th style={loggedUser.userRole === 'User' ? { display: 'none' } : { textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users &&
                                users.map((data, i) => (
                                    <tr key={data.id}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td>{data.username}</td>
                                        <td>{data.email}</td>
                                        <td>{data.phone ? data.phone : 'Null'}</td>
                                        <td>
                                            {isEditable === data.id ? (<>
                                                <select
                                                    onChange={(e) => setUpdatedRole(e.target.value)}
                                                    defaultValue={data.userRole}
                                                >
                                                    <option value="User">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </>) : data.userRole}
                                            {/* {data.userRole} */}
                                        </td>
                                        <td style={loggedUser.userRole === 'User' ? { display: 'none' } : { justifyContent: 'center' }} className="tableFlex">
                                            {isEditable === data.id ? (
                                                <>
                                                    <i style={{ cursor: 'pointer' }} onClick={() => handleDiscard()} title="Discard Changes" className="fi fi-br-cross"></i>
                                                    <i style={{ cursor: 'pointer' }} onClick={() => handleSave(data.id)} title="Save Changes" className="fi fi-sr-disk"></i>
                                                </>
                                            ) : (<>
                                                <i style={loggedUser.id === data.id ? { cursor: 'default', color: 'grey' } : { cursor: 'pointer' }} title="Edit Role" onClick={() => handleEditUser(data.id)} className="fi fi-sr-pencil"></i>
                                                <i style={loggedUser.id === data.id ? { cursor: 'default', color: 'grey' } : { cursor: 'pointer', color: 'red' }} onClick={() => handleDelete(data.id)} className="fi fi-rr-trash-empty" title="Delete User"></i>
                                            </>)}
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