"use client"
import { useEffect, useState } from "react"
import { useAdminContext } from "../adminContext"
import { usePathname, useRouter } from "next/navigation"
import { BlindsFallBack } from "@/components/loader"
import Link from "next/link"

export default function Settings() {
    const { isAuthUser, setIsAuthUser } = useAdminContext()
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthe, setIsAuth] = useState(true)
    const [showPass, setShowPass] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [changePass, setChangePass] = useState(true)
    const editOpt = {
        username: '',
        email: '',
        phone: '',
        curPass: '',
        newPass: '',
        conPass: '',
        proImg: null
    };
    const newUserOpt = {
        username: '',
        email: '',
        phone: '',
        userRole: 'User',
        newPass: '',
        conPass: ''
    };
    const [newUser, setNewUser] = useState(newUserOpt);
    const [editUser, setEditUser] = useState(editOpt)

    const handleInp = (event, setState) => {
        const { name, value } = event.target;
        setState(prev => ({ ...prev, [name]: value }));
    }

    const handleProfileImg = async () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')

        input.addEventListener('change', async (event) => {
            let files = event.target.files
            if (!files || files.length === 0) return null;
            else if (editUser) {
                try {
                    await fetch(`/api/uploadImg?path=${editUser.proImg}`, { method: 'delete' })
                }
                catch (err) {
                    console.log(err)
                }
            }
            let imgForm = new FormData()
            imgForm.append('file', files[0])
            try {
                const res = await fetch('/api/uploadImg?path=adminUser', {
                    method: 'post',
                    body: imgForm
                })
                const result = await res.json()
                setEditUser(prev => ({ ...prev, proImg: result.path }))
            }
            catch (err) {
                console.error(err)
            }
        })

        input.click()
    }
    const handleEditUser = async (event) => {
        event.preventDefault();
        const user = localStorage.getItem('loggedUser')
        const loggedUser = JSON.parse(user)
        if (!changePass) {
            const comparePass = editUser.newPass === editUser.conPass;
            if (!comparePass) {
                setErrorMsg('password mismatch')
                return;
            };
        }
        try {
            const res = await fetch(`/api/adminAuth?user=${loggedUser.username}`, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editUser, changePass: !changePass })
            })
            if (res.ok) {
                const result = await res.json()
                setIsAuthUser(false)
                localStorage.removeItem('isLogged')
                localStorage.removeItem('loggedUser')
                console.log(result)
            }
            else {
                const result = await res.json()
                alert(result.res)
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleNewUser = async (event) => {
        event.preventDefault();
        try {
            const comparePass = newUser.newPass === newUser.conPass;
            if (comparePass) {
                setErrorMsg('')
                const res = await fetch('/api/adminAuth', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    credentials:'include',
                    body: JSON.stringify(newUser)
                })
                if (res.ok) {
                    const result = await res.json()
                    setNewUser(newUserOpt)
                    console.log(result)
                }
                else {
                    const result = await res.json()
                    alert(result.res)
                }
            }
            else {
                setErrorMsg('password mismatch')
                return null;
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('loggedUser')
        if (user) {
            const loggedUser = JSON.parse(user)
            setEditUser(prev => ({
                ...prev,
                username: loggedUser.username,
                email: loggedUser.email,
                phone: loggedUser.phone ? loggedUser.phone : '',
                proImg: loggedUser.proImg ? loggedUser.proImg : null
            }))
        }
    }, [])

    useEffect(() => {
        // const isLogged = localStorage.getItem('isLogged')
        if (!isAuthUser) router.push(`/admin/authenticate?path=${pathname}`);
        else setIsAuth(false);
    }, [isAuthUser])
    if (isAuthe) return <BlindsFallBack />
    return (
        <div className="adminRoute settings">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / Settings</p>
                </div>
                <h1>Settings</h1>
                <p>When updating your credentials, ensure that all information is accurate and up-to-date to maintain secure access and proper functionality of the admin panel. Use a strong and unique password to enhance security. Changes to your email or password may require reauthentication for added protection.</p>
                <div className="formCont">
                    <form onSubmit={handleEditUser}>
                        <div className="formSec">
                            <h3>Update Admin Credentials</h3>
                            <div className="row">
                                <div className="card p-1">
                                    <h4 className="mb-4 border-b-1 pb-2">Basic Information</h4>
                                    <label htmlFor="username">Username</label>
                                    <input onChange={(e) => handleInp(e, setEditUser)} value={editUser.username} type="text" name="username" id="username" placeholder="John Doe" required />
                                    <br />
                                    <label htmlFor="email">Email</label>
                                    <input onChange={(e) => handleInp(e, setEditUser)} value={editUser.email} type="email" name="email" id="email" placeholder="example@gmail.com" required />
                                    <br />
                                    <label htmlFor="phone">Phone(optional)</label>
                                    <input onChange={(e) => handleInp(e, setEditUser)} value={editUser.phone} type="tel" name="phone" id="phone" placeholder="+44 124784 787878" />
                                </div>
                                <div className="card p-1">
                                    <h4 className="mb-4 border-b-1 pb-2">Authentication</h4>
                                    <label htmlFor="curPass">Current Password</label>
                                    <input onChange={(e) => handleInp(e, setEditUser)} value={editUser.curPass} type={showPass ? 'text' : 'password'} name="curPass" id="curPass" placeholder="Current Password" required />
                                    <br />
                                    <label htmlFor="newPass">New Password</label>
                                    <input onChange={(e) => handleInp(e, setEditUser)} disabled={changePass} value={editUser.newPass} type={showPass ? 'text' : 'password'} name="newPass" id="newPass" placeholder="New Password" required />
                                    <br />
                                    <label htmlFor="conPass">Confirm Password</label>
                                    <input onChange={(e) => handleInp(e, setEditUser)} disabled={changePass} value={editUser.conPass} type={showPass ? 'text' : 'password'} name="conPass" id="conPass" placeholder="Confirm Password" required />
                                    <p style={{ color: 'red' }}>{errorMsg}</p>
                                    <br />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input onChange={(e) => setShowPass(!showPass)} checked={showPass} style={{ width: 'fit-content', height: 'fit-content', cursor: 'pointer', marginBottom: '0px', outline: 'none' }} type="checkbox" name="showPass" id="show" />
                                        <label style={{ cursor: 'pointer', userSelect: 'none' }} htmlFor="show">Show Password</label>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input onChange={(e) => setChangePass(!changePass)} checked={!changePass} style={{ width: 'fit-content', height: 'fit-content', cursor: 'pointer', marginBottom: '0px', outline: 'none' }} type="checkbox" name="showPass" id="changePass" />
                                        <label style={{ cursor: 'pointer', userSelect: 'none' }} htmlFor="changePass">Change Password</label>
                                    </div>
                                </div>
                                <div className="card p-1">
                                    <h4 className="mb-4 border-b-1 pb-2">Profile Picture</h4>
                                    <label htmlFor="profile">Select Picture</label>
                                    <div className="img-select" onClick={handleProfileImg}>
                                        {editUser.proImg && (
                                            <img src={editUser.proImg} alt="user" width={100} />
                                        )}
                                        <h4>Click</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="row just-right p-1">
                                <button className="btn-secondary" onClick={() => setEditUser(editOpt)} type="button">Discard</button>
                                &nbsp;&nbsp;
                                <button className="btn-primary" type="submit">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="formCont">
                    <form onSubmit={handleNewUser}>
                        <div className="formSec">
                            <h3>Add new Admin/User</h3>
                            <div className="row">
                                <div className="card p-1">
                                    {/* <h4 className="mb-4 border-b-1 pb-2">Basic Information</h4> */}
                                    <label htmlFor="newUsername">Username</label>
                                    <input onChange={(e) => handleInp(e, setNewUser)} value={newUser.username} type="text" name="username" id="newUsername" placeholder="John Doe" required />
                                    <br />
                                    <label htmlFor="newEmail">Email</label>
                                    <input onChange={(e) => handleInp(e, setNewUser)} value={newUser.email} type="email" name="email" id="newEmail" placeholder="example@gmail.com" required />
                                    <br />
                                    <label htmlFor="newPhone">Phone(optional)</label>
                                    <input onChange={(e) => handleInp(e, setNewUser)} value={newUser.phone} type="tel" name="phone" id="newPhone" placeholder="+44 124784 787878" />
                                </div>
                                <div className="card p-1">
                                    {/* <h4 className="mb-4 border-b-1 pb-2">Authentication</h4> */}
                                    <label htmlFor="userRole">Role</label>
                                    <select onChange={(e) => handleInp(e, setNewUser)} defaultValue={newUser.role} name="userRole" id="userRole" required>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <br />
                                    <label htmlFor="newUserPass">New Password</label>
                                    <input onChange={(e) => handleInp(e, setNewUser)} value={newUser.newPass} type={showPass ? 'text' : 'password'} name="newPass" id="newUserPass" placeholder="New Password" required />
                                    <br />
                                    <label htmlFor="conUserPass">Confirm Password</label>
                                    <input onChange={(e) => handleInp(e, setNewUser)} value={newUser.conPass} type={showPass ? 'text' : 'password'} name="conPass" id="conUserPass" placeholder="Confirm Password" required />
                                    <p style={{ color: 'red' }}>{errorMsg}</p>
                                    <br />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <input onChange={(e) => setShowPass(!showPass)} checked={showPass} style={{ width: 'fit-content', height: 'fit-content', cursor: 'pointer', marginBottom: '0px', outline: 'none' }} type="checkbox" name="showPass" id="showPass" />
                                        <label style={{ cursor: 'pointer', userSelect: 'none' }} htmlFor="showPass">Show Password</label>
                                    </div>
                                </div>
                                {/* <div className="card p-1"> */}
                                {/* <h4 className="mb-4 border-b-1 pb-2">Profile Picture</h4> */}
                                {/* <label htmlFor="profile">Select Picture</label>
                                    <div className="img-select" onClick={handleProfileImg}>Click</div>
                                </div> */}
                            </div>
                            <div className="row just-right p-1">
                                <button className="btn-secondary" onClick={() => setNewUser(newUserOpt)} type="button">Discard</button>
                                &nbsp;&nbsp;
                                <button className="btn-primary" type="submit">Add User</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}