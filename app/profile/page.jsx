"use client"


import FallBackLoader from "@/components/loader"
import ProfileSidePanel from "@/components/profileSidePanel"
import { useDataContext } from "@/context"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function Profile() {
    const router = useRouter()
    const { loggedUser } = useDataContext()
    const [userCred, setUserCred] = useState({
        LastName: '',
        FirstName: '',
        Email: '',
        Password: ''
    });
    const [userInfo, setUserInfo] = useState()
    const [isLoading, setIsloading] = useState(false)
    const [isEditable, setIsEditable] = useState(false)
    const [isEdited, setIsEdited] = useState(false);
    const [showPass, setShowPass] = useState(false)

    const handleInput = (event) => {
        setIsEdited(true)
        const { name, value } = event.target;
        setUserCred(prev => ({ ...prev, [name]: value }));
    }

    const handleUpdateCred = async () => {
        if (isEdited) {
            const { value: password } = await Swal.fire({
                title: 'Enter you current password',
                input: 'password',
                inputLabel: 'Password',
                inputPlaceholder: 'Enter your current password',
                inputAttributes: {
                    maxlength: "10",
                    autocapitalize: "off",
                    autocorrect: "off"
                }
            })
            if (password) {
                try {
                    const res = await fetch(`/api/user?action=checkpass&pass=${password}&userEmail=${userInfo.Email}`);
                    if (res.ok) {
                        await fetch('/api/user', {
                            method: 'put',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...userCred, currentEmail: userInfo.Email })
                        })
                        Swal.fire({
                            icon: 'success',
                            title: 'Updated Successfully',
                            text: 'Your credentials have been updated successfully. For security reasons, please log in again with your new credentials to continue.',
                            showConfirmButton: false,
                            showCloseButton: false
                        })
                        setIsEdited(false)
                        await fetch('/api/user?action=logout', {
                            method: 'POST',
                            credentials: "include",
                            body: JSON.stringify({ req: "Logout Request" })
                        })
                        localStorage.removeItem('user')
                        localStorage.removeItem('cart')
                        setTimeout(() => router.push('/login?retTo=/profile'), 2000)
                        return;
                    }
                    Swal.fire({
                        icon: 'error',
                        title: 'Icorrect Password',
                        text: "The password you entered is incorrect. If you've forgotten your password, please click the link below to reset it!",
                        footer: '<a href={"/auth"}>Forget Password</a>'
                    })
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
    }

    const fetchUser = async (email) => {
        try {
            const res = await fetch(`/api/user?userEmail=${email}`);
            const result = await res.json();
            setUserInfo(result)
            setUserCred({
                FirstName: result.FirstName || '',
                LastName: result.LastName || '',
                Email: result.Email || '',
                Password: ''
            })
            if (result.AuthMethod === 'google') {
                setIsEditable(true)
                return;
            }
            setIsEditable(false)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        document.title = 'Profile | PurEssence'
        let user = localStorage.getItem('user')
        if (!user) {
            router.push('/login?retTo=/profile')
        }
        else {
            const parsed = JSON.parse(user)
            fetchUser(parsed.Email)
            setTimeout(() => setIsloading(false), 500)
        }

        return () => (document.body.style.overflow = 'auto');
    }, [])
    if (!loggedUser || isLoading) {
        return <FallBackLoader />
    }
    return (
        <>
            <div className="proMainCont">
                <ProfileSidePanel />
                <div className="rightPanel">
                    <div style={{ display: 'flex' }} className="editCont tab" data-value={'editProfile'}>
                        <h1>Edit Profile</h1>
                        <div className="editSubCont">
                            <div className="nameCont">
                                <label htmlFor="firstName">First Name</label>
                                <input disabled={isEditable} onChange={handleInput} value={userCred.FirstName} name="FirstName" type="text" id="firstName" required placeholder="First Name" />
                                <label htmlFor="lastName">Last Name</label>
                                <input disabled={isEditable} onChange={handleInput} value={userCred.LastName} type="text" name="LastName" id="lastName" required placeholder="Last Name" />
                            </div>
                            <div className="emailCont">
                                <label htmlFor="email">Email</label>
                                <input disabled={isEditable} onChange={handleInput} value={userCred.Email} name="Email" type="email" id="email" required placeholder="example@gmail.com" />
                                <label htmlFor="newPass">New Password</label>
                                <div className="inpass">
                                    <input disabled={isEditable} onChange={handleInput} value={userCred.Password} name="Password" type={showPass ? 'text' : 'password'} id="newPass" required placeholder="New Password" />
                                    <FontAwesomeIcon style={{ cursor: 'pointer' }} onClick={() => setShowPass(!showPass)} icon={showPass ? faEye : faEyeSlash} />
                                </div>

                            </div>
                        </div>
                        <button disabled={isEditable} style={isEditable ? { backgroundColor: 'grey' } : null} onClick={handleUpdateCred} className="saveBtn" type="button">Save</button>

                        <h2 style={{ marginTop: '50px' }}>Note: Users registered with Email Registration can edit their credentials, while those signed up via Google Registration must manage details through their Google account.
                        </h2>
                    </div>

                </div>
            </div>
        </>
    )
}