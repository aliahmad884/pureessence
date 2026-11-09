'use client'

import GoogleBtn from "@/components/googleBtn"
import FallBackLoader from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDataContext } from "@/context"
import { CircleAlert, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import Swal from "sweetalert2"

const inputClass =
    "h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-white/40 " +
    "focus-visible:border-[#e6b02f] focus-visible:ring-[#e6b02f]/30 " +
    "[&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#222]"

export default function Login() {
    const searchParams = useSearchParams()
    const err = searchParams.get('err')
    const path = searchParams.get('retTo')
    const isGoogleAuth = searchParams.get('authMethod')
    const router = useRouter()
    const { setCartData, setLoggedUser, setIsLogged } = useDataContext()
    const [email, setEmail] = useState('')
    const [pass, setPas] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [passState, setPassState] = useState(false)
    const [alertFired, setAlertFired] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)

    const handleLogin = (event) => {
        event.preventDefault();
        if (email === '' && pass === '') {
            setErrMsg('Please fill out the form first.')
            return null;
        }
        else if (email === '') {
            setErrMsg('Email cannot be empty.')
            return null;
        } else if (pass === '') {
            setErrMsg('Password cannot be empty.')
            return null;
        }
        setBtnLoading(true)
        fetch('/api/user?action=login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Email: email,
                Password: pass
            })
        }).then(res => res.json()).then(data => {
            if (data.err) {
                Swal.fire({
                    icon: 'info',
                    text: "The email you entered is associated with a Google account. Please use the 'Sign in with Google' option to log in."
                })
                setBtnLoading(false)
            }
            else if (data.Name) {
                localStorage.setItem('user', JSON.stringify(data))
                setIsLogged(true)
                setErrMsg('')
                setLoggedUser(data)
                setCartData([])
                setIsLoading(false)
                router.push(path ? path : '/')
            } else {
                setErrMsg(data.res)
                setBtnLoading(false)
            }
        }).catch(err => {
            console.log(err)
            setErrMsg('Something went wrong. Please try again.')
            setBtnLoading(false)
        })
    }

    const handleGoogleLogin = async () => {
        await signIn("google")
    }

    const googleSignup = async () => {
        const name = searchParams.get('Name');
        const email = searchParams.get('Email')
        const response = await fetch('/api/user?action=login&authMethod=google', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Email: email,
            })
        })
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify({ Name: name, Email: email }))
            setIsLogged(true);
            setLoggedUser({ Name: name, Email: email });
            setCartData([]);
            router.push('/')
        }
        else {
            setIsLoading(false)
            alert('Google login is not working! please try again.')
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('user')
        document.title = 'Login | PurEssence'
        if (isGoogleAuth) {
            setIsLoading(true)
            googleSignup()
        }
        else if (err === 'EBNG' && alertFired) {
            setAlertFired(false)
            Swal.fire({
                icon: 'error',
                title: 'Email already exists!',
                text: 'This email is already associated with an account. Please log in using this email, or use a different account to sign in.'
            }).then(() => {
                router.replace('/login')
            })
        }
        else if (user) router.push('/')
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [email, pass])

    if (isLoading) {
        return <FallBackLoader />
    }

    return (
        <main className="mt-[-120px] flex min-h-screen flex-col bg-[#181818] text-white">
            {/* Top bar with logo, dark, flush to the top */}
            <header className="sticky top-0 z-10 m-0 border-b border-white/10 bg-[#202020]">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
                    <Link href="/" aria-label="Pure Essence home">
                        <img src="/logos/PE-Main-Logo.png" alt="Pure Essence" width={200} loading="lazy" />
                    </Link>
                    <p className="hidden text-sm font-medium text-white/70 sm:block">
                        &ldquo;The Purest Products, For a Better You&rdquo;
                    </p>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[#e6b02f]/60 to-transparent" />
            </header>

            {/* Centered sign-in card */}
            <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
                <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6b02f]/10 blur-3xl" />

                <div className="relative w-full max-w-[440px] rounded-3xl border border-white/10 bg-[#1e1e1e] p-6 shadow-2xl shadow-black/50 sm:p-10">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Sign in to <span className="text-[#e6b02f]">PURE</span> ESSENCE
                        </h1>
                        <p className="mt-2 text-sm text-white/60">Enter your details to continue.</p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white/80">Email</Label>
                            <div className="relative">
                                <Mail aria-hidden="true" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white/80">Password</Label>
                            <div className="relative">
                                <Lock aria-hidden="true" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={passState ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={pass}
                                    onChange={(e) => setPas(e.target.value)}
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setPassState(!passState)}
                                    aria-label={passState ? 'Hide password' : 'Show password'}
                                    aria-pressed={passState}
                                    className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                                >
                                    {passState ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    className="border-white/30 data-[state=checked]:border-[#e6b02f] data-[state=checked]:bg-[#e6b02f] data-[state=checked]:text-[#181818]"
                                />
                                <Label htmlFor="remember" className="cursor-pointer font-normal text-white/70">
                                    Remember me
                                </Label>
                            </div>
                            <Link href="#" className="text-white/60 underline-offset-4 transition hover:text-[#e6b02f] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        {errMsg && (
                            <div
                                role="alert"
                                className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                            >
                                <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                                <span>{errMsg}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={btnLoading}
                            className="h-12 w-full rounded-xl bg-[#e6b02f] text-base font-semibold text-[#181818] hover:bg-[#f0c04d] disabled:opacity-70"
                        >
                            {btnLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                                    Signing in
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>

                    <div className="my-7 flex items-center gap-4 text-xs text-white/50">
                        <span className="h-px flex-1 bg-white/10" />
                        or continue with
                        <span className="h-px flex-1 bg-white/10" />
                    </div>

                    <GoogleBtn clickHandler={handleGoogleLogin} textContent={'Sign in with Google'} />

                    <p className="mt-8 text-center text-sm text-white/60">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="font-medium text-[#e6b02f] underline-offset-4 hover:underline">
                            Sign up now
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )
}