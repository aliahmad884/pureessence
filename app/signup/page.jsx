'use client'

import GoogleBtn from "@/components/googleBtn"
import FallBackLoader from "@/components/loader"
import { useDataContext } from "@/context"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Signup() {
    const searchParams = useSearchParams()
    const path = searchParams.get('retTo')
    const router = useRouter()
    const { setCartData, setLoggedUser, setIsLogged, DOMLoaded, SetDOMLoaded } = useDataContext()
    const [email, setEmail] = useState('')
    const [pass, setPas] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [passState, setPassState] = useState(false)
    const handleLogin = (event) => {
        event.preventDefault();
        if (email === '' && pass === '' && firstName === '' && lastName === '') {
            setErrMsg('Please fill out form first!')
            return null;
        }
        else if (firstName === '') {
            setErrMsg('First Name cannot be empty!')
            return null;
        } else if (lastName === '') {
            setErrMsg('Last Name cannot be empty!')
            return null;
        }
        else if (email === '') {
            setErrMsg('Email cannot be empty!')
            return null;
        } else if (pass === '') {
            setErrMsg('Password cannot be empty!')
            return null;
        }
        setIsLoading(true)
        fetch('/api/user?action=signup', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: pass
            })
        }).then(res => {
            if(res.status===201){
                alert('User Registered Successfully!')
                router.push('/login')
            }
        }).then(data => {
            // if (data.Name) {
            // localStorage.setItem('user', JSON.stringify(data))
            // setIsLogged(true)
            // setErrMsg('')
            // setLoggedUser(data)
            // setCartData([])
            setIsLoading(false)
            // SetDOMLoaded(true)
            // setTimeout(() => {
            //     router.push(path)
            // }, 1000)
            // } else {
            setErrMsg(data.res)
            // setIsLoading(false)
            // }
            console.log(data)
        }).catch(err => console.log(err))
    }
    const handlePassState = () => {
        setPassState(!passState)
    }
    useEffect(() => {

        setErrMsg('')
    }, [email, pass, firstName, lastName])
    if (DOMLoaded) {
        return <FallBackLoader />
    }
    return (
        <>
            <div className="signupMainCont">
                <div className="header">
                    <div className="logo">
                        <img src="/CircleLogo.webp" alt="Logo" width={50} />
                        <div onClick={() => router.push('/')}>
                            <h1 style={{ color: 'black' }}><strong style={{ color: '#dfb434' }}>Pure</strong> Essence</h1>
                            <p style={{ color: 'black' }}>The Purest Products, For a Better You.</p>
                        </div>
                    </div>
                </div>
                <div className="footBar"></div>
                <div className="signupImgCont">
                    <img src="/login.webp" alt="Login" />
                </div>
                <div className="formCont">
                    <div className="signupForm">
                        <h1>Sign Up to <strong style={{ color: '#dfb434' }}>PURE</strong> ESSENCE</h1>
                        <form onSubmit={handleLogin}>
                            <div className="fullName">
                                <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" name="firstName" id="firstName" autoComplete="given-name" placeholder="First Name" />
                                <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" name="lastName" id="lastName" autoComplete="family-name" placeholder="Last Name" />
                            </div>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="email" id="email" autoComplete="email" placeholder="Email" />
                            {/* <p>dsfds</p> */}
                            <div className="eyeCont">
                                <input onChange={(e) => setPas(e.target.value)} value={pass} type={passState ? 'text' : 'password'} name="password" autoComplete="current-password" id="password" placeholder="Password" />
                                <FontAwesomeIcon onClick={handlePassState} className="eye" icon={passState ? faEye : faEyeSlash} />
                            </div>
                            <p>{errMsg}</p>
                            {/* <div className="remember">
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', gap: '10px', borderRadius: '50%' }}>
                                    <input type="checkbox" name="remember" id="remember" />
                                    <label style={{ cursor: 'pointer' }} htmlFor="remember">Remember me</label>
                                </div>
                                <a href="#">Forgot Password?</a>
                            </div> */}
                            <button type="submit">{isLoading ? (<span className="loader"></span>) : 'Sign Up'}</button>
                        </form>
                        <h3>Or sign up with</h3>
                        <hr />
                        <GoogleBtn textContent={'Sign up with Google'} />
                        {/* <button className="googleBtn" type="button">Google</button> */}
                        <h4>Already have an account? <Link href="/login?retTo=/">Login Now</Link></h4>
                    </div>
                </div>
            </div>

        </>
    )
}