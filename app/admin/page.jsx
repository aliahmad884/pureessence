'use client'

import { useDataContext } from "@/context"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminHome() {
    const router = useRouter()
    const { setCartData, setLoggedUser,setIsLogged } = useDataContext()
    const [email, setEmail] = useState('')
    const [pass, setPas] = useState('')
    const [user, setUser] = useState(null)
    const handleLogin = (event) => {
        event.preventDefault();
        fetch('/api/user?action=login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Email: email,
                Password: pass
            })
        }).then(res => res.json()).then(data => {
            if (data.Name) {
                setUser(data)
                localStorage.setItem('user', JSON.stringify(data))
                setIsLogged(true)
                setLoggedUser(data)
                setCartData([])
                router.push('/')
            } else {
                setUser('')
                alert(data.res)
            }
        }).catch(err => console.log(err))
    }
    return (
        <>
            <h1>Welcome to Admin Home...!</h1>
            <ul>
                <li>User:{user ? user.Name : ''}</li>
                <li>Email:{user ? user.Email : ''}</li>
            </ul>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Emali</label>
                <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Email" />
                <label htmlFor="password">Password</label>
                <input onChange={(e) => setPas(e.target.value)} type="password" name="password" id="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </>
    )
}