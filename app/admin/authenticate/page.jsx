"use client"

import { useEffect, useState } from "react";
import { useAdminContext } from "../adminContext";
import { useRouter, useSearchParams } from "next/navigation"

export default function Auth() {
    const param = useSearchParams()
    const path = param.get('path')
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const { isAuthUser, setIsAuthUser, setLoggedUser } = useAdminContext();
    const [errMsg, setErrMsg] = useState("");

    const handleInput = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch('/api/adminAuth?action=login', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                let result = await res.json();
                setIsAuthUser(true)
                setLoggedUser(result)
                localStorage.setItem('isLogged', true)
                localStorage.setItem('loggedUser', JSON.stringify(result))
                router.push(path ? path : '/admin')
            }
            else {
                let result = await res.json();
                setErrMsg(result.res);
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            <div style={{ marginTop: '-95px', display: 'flex', flexFlow: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', height: '90vh', padding: '0 20px' }}>
                <div className="formCont" style={{ maxWidth: '400px', width: '100%', marginTop: '0' }}>
                    <form onSubmit={handleSubmit} autoComplete="on">
                        <div className="formSec" style={{ marginTop: '0' }}>
                            <h3><img style={{ margin: 'auto' }} src="/logos/apanel.png" alt="Apanel" loading="lazy" width={150} /></h3>
                            <label htmlFor="username">Username</label>
                            <input onChange={handleInput} type="text" name="username" id="username" required placeholder="Username" autoComplete="username" />
                            <br />
                            <label htmlFor="pass">Password</label>
                            <input onChange={handleInput} type="password" name="password" id="pass" required placeholder="Password" autoComplete="current-password" />
                            <p style={{ color: 'red' }}>{errMsg}</p>
                            <br />
                            <button type="submit" style={{ padding: '10px 50px', backgroundColor: 'blueviolet', color: 'white' }}>Unlock</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}