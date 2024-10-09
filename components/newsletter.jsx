"use client"
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NewsLetter() {
    const [email, setEmail] = useState()
    const [isSending, setIsSending] = useState(false)
    const handleSubmit = () => {
        setIsSending(true)
        fetch('/api/newletter', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        }).then(res => {
            if (!res.ok) {
                toast.error('Something went wrong, please try again!')
                setEmail('')
                setIsSending(false)
                return null;
            }
            toast.success('You have successfully joined our newsletter!')
            setEmail('')
            setIsSending(false)
        }).catch(err => {
            console.log(err)
            toast.error('Something went wrong, please try again!')
            setEmail('')
            setIsSending(false)
        })
    }

    return (
        <>
            <Toaster />
            <div className="letterCont">
                <div className="text">
                    <h1>Join Our Value Newsletter</h1>
                    <p>Discounts, health guides and more! All without spam or annoying frequent emails. Unsubscribe anytime.</p>
                </div>
                <div className="inputCont">
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="newsEmail" placeholder="Enter Your Email..." autoComplete="email" />
                    <button onClick={handleSubmit} type="button">{isSending ? 'Please Wait...' : 'Join Now'}</button>
                </div>
            </div>
        </>
    )
}