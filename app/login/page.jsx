'use client'

import GoogleBtn from "@/components/googleBtn"
import FallBackLoader from "@/components/loader"
import { useDataContext } from "@/context"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Login() {
    const searchParams = useSearchParams()
    const path = searchParams.get('retTo')
    const router = useRouter()
    const { setCartData, setLoggedUser, setIsLogged, DOMLoaded, SetDOMLoaded } = useDataContext()
    const [email, setEmail] = useState('')
    const [pass, setPas] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [passState, setPassState] = useState(false)
    const handleLogin = (event) => {
        event.preventDefault();
        if (email === '' && pass === '') {
            setErrMsg('Please fill out form first!')
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
        fetch('/api/user?action=login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Email: email,
                Password: pass
            })
        }).then(res => res.json()).then(data => {
            if (data.Name) {
                localStorage.setItem('user', JSON.stringify(data))
                setIsLogged(true)
                setErrMsg('')
                setLoggedUser(data)
                setCartData([])
                setIsLoading(false)
                SetDOMLoaded(true)
                // setTimeout(() => {
                router.push(path ? path : '/')
                // }, 1000)
            } else {
                setErrMsg(data.res)
                setIsLoading(false)
            }
        }).catch(err => console.log(err))
    }
    const handlePassState = () => {
        setPassState(!passState)
    }
    useEffect(() => {

        setErrMsg('')
    }, [email, pass])
    if (DOMLoaded) {
        return <FallBackLoader />
    }
    return (
        <>
            <div className="loginMainCont">
                <div className="header">
                    <div className="subCont">
                        <Link href={'/'}><img src="/logos/PE-Main-Logo.png" alt="Logo" loading="lazy" width={280} /></Link>
                        <p><strong>&quot;The Purest Products,For a Better You&quot;</strong></p>
                    </div>
                </div>
                <div className="footBar"></div>
                <div className="loginImgCont">
                    <img loading="lazy" src="/login.webp" alt="" />
                </div>
                <div className="formCont">
                    <div className="loginForm">
                        <h1>Sign in to <strong style={{ color: '#dfb434' }}>PURE</strong> ESSENCE</h1>
                        <form onSubmit={handleLogin}>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="email" id="email" autoComplete="email" placeholder="Email" />
                            <div className="eyeCont">
                                <input onChange={(e) => setPas(e.target.value)} value={pass} type={passState ? 'text' : 'password'} name="password" autoComplete="current-password" id="password" placeholder="Password" />
                                <FontAwesomeIcon onClick={handlePassState} className="eye" icon={passState ? faEye : faEyeSlash} />
                            </div>
                            <p>{errMsg}</p>
                            <div className="remember">
                                <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', gap: '10px', borderRadius: '50%' }}>
                                    <input type="checkbox" name="remember" id="remember" />
                                    <label style={{ cursor: 'pointer' }} htmlFor="remember">Remember me</label>
                                </div>
                                <a href="#">Forgot Password?</a>
                            </div>
                            <button type="submit">{isLoading ? (<span className="loader"></span>) : 'Sign in'}</button>
                        </form>
                        <h3>Or login with</h3>
                        <hr />
                        <GoogleBtn textContent={'Sign in with Google'} />
                        {/* <button className="googleBtn" type="button">Google</button> */}
                        <h4>Dont&apos;t have an account? <Link href="/signup">Sign Up Now</Link></h4>
                    </div>
                </div>
            </div>

        </>
    )
}