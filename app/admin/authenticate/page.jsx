"use client"

import { useEffect, useState } from "react";
import { useAdminContext } from "../adminContext";
import { useRouter } from "next/navigation"

export default function Auth() {
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const { isAuthUser, setIsAuthUser } = useAdminContext();
    const [errMsg, setErrMsg] = useState("");

    const handleInput = (event) => {
        const { name, value } = event.target;
        setFormData(prev=>({ ...prev, [name]: value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch('/api/user?action=adminAuth', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setIsAuthUser(true)
                router.push('/admin')
            }
            let result = await res.json();
            setErrMsg(result.res);
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            <div style={{ display: 'flex', flexFlow: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <div className="formCont" style={{ maxWidth: '400px', width: '100%' }}>
                    <form onSubmit={handleSubmit} autoComplete="on">
                        <div className="formSec">
                            <h3 style={{ textAlign: 'center' }}>Admin Login</h3>
                            <label htmlFor="username">Username</label>
                            <input onChange={handleInput} type="text" name="username" id="username" required placeholder="Username" autoComplete="username"/>
                            <br />
                            <label htmlFor="pass">Password</label>
                            <input onChange={handleInput} type="password" name="password" id="pass" required placeholder="Password" autoComplete="current-password" />
                            <p style={{ color: 'red' }}>{errMsg}</p>
                            <br />
                            <button type="submit" style={{ padding: '10px 50px', backgroundColor: 'blueviolet', color: 'white' }}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}