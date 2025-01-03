'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Auth() {
    const [mail, setMail] = useState(true);
    const [otp, setOtp] = useState(false);
    const [pass, setPass] = useState(false);
    const [done, setDone] = useState(false);
    useEffect(() => {
        document.title = 'Forget Password | PurEssence'
    }, [])
    return (
        <>
            <div className="forgetMainCont">
                <div className="header">
                    <div className="subCont">
                        <Link href={'/'}><img src="/logos/PE-Main-Logo.png" alt="Logo" loading="lazy" width={280} /></Link>
                        <p><strong>&quot;The Purest Products,For a Better You&quot;</strong></p>
                    </div>
                </div>

                <div className="forgetForm mail" style={mail ? null : { display: 'none' }}>
                    <i className="fi fi-rr-fingerprint"></i>
                    <h1>Forget Password?</h1>
                    <p>Enter your email for next step!</p>
                    <input type="email" name="email" id="email" placeholder="Enter you email" />
                    <button type="button" onClick={() => {
                        setMail(false)
                        setOtp(true)
                    }}>Send 4-digit code</button>
                </div>

                <div className="forgetForm otp" style={otp ? null : { display: 'none' }}>
                    <i className="fi fi-sr-envelope-open"></i>
                    <h1>Enter your code</h1>
                    <p>We sent a code to example@gmail.com!</p>
                    <input type="text" name="otp" id="otp" placeholder="Enter you code" />
                    <p>Did&apos;t recieved the email?click to resend</p>
                    <button type="button" onClick={() => {
                        setOtp(false)
                        setPass(true)
                    }}>Continue</button>
                </div>

                <div className="forgetForm pass" style={pass ? null : { display: 'none' }}>
                    <i className="fi fi-ss-hashtag-lock"></i>
                    <h1>Set new password</h1>
                    <p>Password must be at least 8 characters!</p>
                    <input type="password" name="pass" id="pass" placeholder="New Password" />
                    <input type="password" name="confirmPass" id="confirmPass" placeholder="Confirm Password" />
                    <button type="button" onClick={() => {
                        setPass(false)
                        setDone(true)
                    }}>Set new password</button>
                </div>

                <div className="forgetForm done" style={done ? null : { display: 'none' }}>
                    <i className="fi fi-ss-octagon-check"></i>
                    <h1>All done</h1>
                    <p>Your password has been reset. You will be redirected to the login page shortly!</p>
                </div>

            </div >
        </>
    )
}