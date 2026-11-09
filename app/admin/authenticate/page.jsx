
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAdminContext } from "../adminContext"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { toast } from "sonner"
import {
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react"

export default function Auth() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const path = searchParams.get("path")

    const { setLoggedUser } = useAdminContext()

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState("")

    const handleInput = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (errMsg) setErrMsg("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (isLoading) return

        setIsLoading(true)
        setErrMsg("")

        try {
            const res = await fetch("/api/adminAuth?action=login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const result = await res.json()

            if (!res.ok) {
                const message = result?.res || "Invalid username or password."
                setErrMsg(message)
                toast.error(message)
                return
            }

            setLoggedUser(result)
            toast.success("Login successful")

            router.replace(path || "/admin")
            router.refresh()
        } catch (error) {
            console.error("Admin login error:", error)

            const message = "Unable to connect to the server. Please try again."
            setErrMsg(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-vh items-center justify-center px-4 py-10">
            <div className="w-full max-w-[420px]">

                <Card className="border-border/70 shadow-lg shadow-black/5">
                    <CardHeader className="space-y-1 pb-5">
                        <CardTitle className="text-xl">
                            Welcome back
                        </CardTitle>

                        <CardDescription>
                            Enter your credentials to continue.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username">
                                    Username
                                </Label>

                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    value={formData.username}
                                    onChange={handleInput}
                                    required
                                    disabled={isLoading}
                                    className="h-11"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleInput}
                                        required
                                        disabled={isLoading}
                                        className="h-11 pr-11"
                                    />

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Error message */}
                            {errMsg && (
                                <div
                                    role="alert"
                                    className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
                                >
                                    {errMsg}
                                </div>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="h-11 w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LockKeyhole className="mr-2 size-4" />
                                        Sign in to Dashboard
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}