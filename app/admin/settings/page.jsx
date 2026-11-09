"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Camera, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useAdminContext } from "../adminContext"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const emptyProfile = {
    username: "",
    email: "",
    newPass: "",
    conPass: "",
    proImg: null,
}

const emptyNewUser = {
    username: "",
    email: "",
    userRole: "User",
    newPass: "",
    conPass: "",
}

// Reads the logged-in user saved by the login flow
const readStoredUser = () => {
    try {
        const raw = localStorage.getItem("loggedUser")
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

// Password input with the show/hide eye inside the field
function PasswordInput({ disabled, ...props }) {
    const [visible, setVisible] = useState(false)
    return (
        <InputGroup>
            <InputGroupInput type={visible ? "text" : "password"} disabled={disabled} {...props} />
            <InputGroupAddon align="inline-end">
                <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    disabled={disabled}
                    aria-label={visible ? "Hide password" : "Show password"}
                    onClick={() => setVisible((v) => !v)}
                >
                    {visible ? <EyeOff /> : <Eye />}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    )
}

export default function Settings() {
    const { loggedUser, setLoggedUser } = useAdminContext()

    // ---- profile form state ----
    const [editUser, setEditUser] = useState(emptyProfile)
    const [isEditing, setIsEditing] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [profileError, setProfileError] = useState("")
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    // ---- password confirmation dialog ----
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmPass, setConfirmPass] = useState("")
    const [confirmError, setConfirmError] = useState("")
    const [saving, setSaving] = useState(false)

    // ---- new user form state ----
    const [newUser, setNewUser] = useState(emptyNewUser)
    const [newUserError, setNewUserError] = useState("")
    const [adding, setAdding] = useState(false)

    const fillFromStoredUser = () => {
        const stored = readStoredUser()
        if (!loggedUser) return
        setEditUser({
            ...emptyProfile,
            username: loggedUser.username ?? "",
            email: loggedUser.email ?? "",
            proImg: loggedUser.proImg ?? null,
        })
    }

    useEffect(() => {
        fillFromStoredUser()
    }, [])

    const handleInp = (event, setState) => {
        const { name, value } = event.target
        setState((prev) => ({ ...prev, [name]: value }))
    }

    // ---- profile picture ----
    const handleProfileImg = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            // remove the previous picture, if any
            if (editUser.proImg) {
                try {
                    await fetch(`/api/uploadImg?path=${editUser.proImg}`, { method: "delete" })
                } catch (err) {
                    console.log(err)
                }
            }
            const imgForm = new FormData()
            imgForm.append("file", file)
            const res = await fetch("/api/uploadImg?path=adminUser", {
                method: "post",
                body: imgForm,
            })
            const result = await res.json()
            setEditUser((prev) => ({ ...prev, proImg: result.path }))
        } catch (err) {
            console.error(err)
            toast.error("Couldn't upload the picture. Try again.")
        } finally {
            setUploading(false)
            event.target.value = ""
        }
    }

    // ---- profile submit: validate, then ask for the current password ----
    const handleEditUser = (event) => {
        event.preventDefault()
        if (changePassword && editUser.newPass !== editUser.conPass) {
            setProfileError("Passwords don't match")
            return
        }
        setProfileError("")
        setConfirmPass("")
        setConfirmError("")
        setConfirmOpen(true)
    }

    const handleConfirmSave = async (event) => {
        event.preventDefault()
        if (!confirmPass) return

        if (!loggedUser) {
            setConfirmError("Your session has expired. Sign in again.")
            return
        }

        setSaving(true)
        setConfirmError("")
        try {
            const res = await fetch(`/api/adminAuth?user=${loggedUser.username}`, {
                method: "put",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...editUser,
                    curPass: confirmPass,
                    changePass: changePassword,
                }),
            })
            const result = await res.json()

            if (res.ok) {
                setConfirmOpen(false)
                setConfirmPass("")
                setChangePassword(false)
                setEditUser((prev) => ({ ...prev, newPass: "", conPass: ""}))
                setLoggedUser(result?.info)
                toast.success("Profile updated", {
                    description: "Your profile has been saved.",
                })
            } else {
                console.log(result.res)
                setConfirmError(result.res || "Incorrect password")
            }
        } catch (err) {
            console.error(err)
            setConfirmError("Something went wrong. Try again.")
        } finally {
            setSaving(false)
        }
    }

    const handleDiscard = () => {
        fillFromStoredUser()
        setChangePassword(false)
        setProfileError("")
    }

    // ---- add new admin / user ----
    const handleNewUser = async (event) => {
        event.preventDefault()
        if (newUser.newPass !== newUser.conPass) {
            setNewUserError("Passwords don't match")
            return
        }
        setNewUserError("")
        setAdding(true)
        try {
            const res = await fetch("/api/adminAuth", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newUser),
            })
            const result = await res.json()
            if (res.ok) {
                setNewUser(emptyNewUser)
                toast.success("User added", {
                    description: `${newUser.username} can now sign in.`,
                })
            } else {
                toast.error("Couldn't add the user", { description: result.res })
            }
        } catch (err) {
            console.error(err)
            toast.error("Something went wrong. Try again.")
        } finally {
            setAdding(false)
        }
    }

    const canManageUsers = loggedUser?.userRole !== "User"
    const initials = (loggedUser?.username || "U").slice(0, 2).toUpperCase()

    return (
        <div className="adminRoute settings">
            <div className="subCont">
                <div className="flex w-full min-w-0 flex-1 justify-center p-4 sm:p-6">
                    <div className="w-full space-y-6">
                        {/* Header */}
                        <div className="space-y-3">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink render={<Link href="/admin" />}>Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>/</BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Settings</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1>
                            <p className="max-w-3xl text-sm text-muted-foreground">
                                Keep your details accurate so you can always sign in to the admin panel. Use a
                                strong, unique password. Changing your email or password may ask you to
                                confirm with your current password.
                            </p>
                        </div>

                        {/* Update admin credentials: picture + credentials */}
                        <form onSubmit={handleEditUser} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
                                {/* Profile picture */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile picture</CardTitle>
                                        <CardDescription>Shown next to your name in the panel.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center gap-4">
                                        <Avatar className="size-24">
                                            {editUser.proImg && (
                                                <AvatarImage src={editUser.proImg} alt={editUser.username} />
                                            )}
                                            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                                        </Avatar>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleProfileImg}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            disabled={!isEditing || uploading}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {uploading ? <Loader2 className="animate-spin" /> : <Camera />}
                                            {uploading ? "Uploading" : "Change picture"}
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Credentials */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="space-y-1">
                                                <CardTitle>Update admin credentials</CardTitle>
                                                <CardDescription>
                                                    Tick Edit profile to unlock the fields.
                                                </CardDescription>
                                            </div>
                                            <Field orientation="horizontal" className="w-auto">
                                                <Checkbox
                                                    id="editPro"
                                                    checked={isEditing}
                                                    onCheckedChange={(checked) => setIsEditing(Boolean(checked))}
                                                />
                                                <FieldLabel htmlFor="editPro" className="cursor-pointer">
                                                    Edit profile
                                                </FieldLabel>
                                            </Field>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                                <Input
                                                    id="username"
                                                    name="username"
                                                    type="text"
                                                    value={loggedUser?.username}
                                                    disabled
                                                    readOnly
                                                />
                                                <FieldDescription>Your username can't be changed.</FieldDescription>
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="example@gmail.com"
                                                    value={editUser.email}
                                                    onChange={(e) => handleInp(e, setEditUser)}
                                                    disabled={!isEditing}
                                                    required
                                                />
                                            </Field>

                                            <Field orientation="horizontal">
                                                <Checkbox
                                                    id="changePass"
                                                    checked={changePassword}
                                                    onCheckedChange={(c) => {
                                                        setChangePassword(Boolean(c))
                                                        setProfileError("")
                                                    }}
                                                    disabled={!isEditing}
                                                />
                                                <FieldLabel htmlFor="changePass" className="cursor-pointer">
                                                    Change password
                                                </FieldLabel>
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="newPass">New password</FieldLabel>
                                                <PasswordInput
                                                    id="newPass"
                                                    name="newPass"
                                                    placeholder="New password"
                                                    autoComplete="new-password"
                                                    value={editUser.newPass}
                                                    onChange={(e) => handleInp(e, setEditUser)}
                                                    disabled={!changePassword || !isEditing}
                                                    required={changePassword}
                                                />
                                            </Field>

                                            <Field data-invalid={Boolean(profileError)}>
                                                <FieldLabel htmlFor="conPass">Confirm password</FieldLabel>
                                                <PasswordInput
                                                    id="conPass"
                                                    name="conPass"
                                                    placeholder="Confirm password"
                                                    autoComplete="new-password"
                                                    aria-invalid={Boolean(profileError)}
                                                    value={editUser.conPass}
                                                    onChange={(e) => handleInp(e, setEditUser)}
                                                    disabled={!changePassword || !isEditing}
                                                    required={changePassword}
                                                />
                                                {profileError && <FieldError>{profileError}</FieldError>}
                                            </Field>
                                        </FieldGroup>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!isEditing}
                                    onClick={handleDiscard}
                                    className="w-full sm:w-auto"
                                >
                                    Discard
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!isEditing || uploading}
                                    className="w-full sm:w-auto"
                                >
                                    Save changes
                                </Button>
                            </div>
                        </form>

                        {/* Add new admin / user */}
                        {canManageUsers && (
                            <form onSubmit={handleNewUser}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Add new admin or user</CardTitle>
                                        <CardDescription>
                                            Create an account and choose what they can access.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="newUsername">Username</FieldLabel>
                                                    <Input
                                                        id="newUsername"
                                                        name="username"
                                                        type="text"
                                                        placeholder="John Doe"
                                                        value={newUser.username}
                                                        onChange={(e) => handleInp(e, setNewUser)}
                                                        required
                                                    />
                                                </Field>
                                                <Field>
                                                    <FieldLabel htmlFor="newEmail">Email</FieldLabel>
                                                    <Input
                                                        id="newEmail"
                                                        name="email"
                                                        type="email"
                                                        placeholder="example@gmail.com"
                                                        value={newUser.email}
                                                        onChange={(e) => handleInp(e, setNewUser)}
                                                        required
                                                    />
                                                </Field>
                                                <Field>
                                                    <FieldLabel htmlFor="userRole">Role</FieldLabel>
                                                    <Select
                                                        value={newUser.userRole}
                                                        onValueChange={(value) =>
                                                            value &&
                                                            setNewUser((prev) => ({ ...prev, userRole: value }))
                                                        }
                                                    >
                                                        <SelectTrigger id="userRole" className="w-full">
                                                            <SelectValue placeholder="Select a role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="User">User</SelectItem>
                                                            <SelectItem value="Admin">Admin</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            </FieldGroup>

                                            <FieldGroup>
                                                <Field>
                                                    <FieldLabel htmlFor="newUserPass">Password</FieldLabel>
                                                    <PasswordInput
                                                        id="newUserPass"
                                                        name="newPass"
                                                        placeholder="Password"
                                                        autoComplete="new-password"
                                                        value={newUser.newPass}
                                                        onChange={(e) => handleInp(e, setNewUser)}
                                                        required
                                                    />
                                                </Field>
                                                <Field data-invalid={Boolean(newUserError)}>
                                                    <FieldLabel htmlFor="conUserPass">Confirm password</FieldLabel>
                                                    <PasswordInput
                                                        id="conUserPass"
                                                        name="conPass"
                                                        placeholder="Confirm password"
                                                        autoComplete="new-password"
                                                        aria-invalid={Boolean(newUserError)}
                                                        value={newUser.conPass}
                                                        onChange={(e) => handleInp(e, setNewUser)}
                                                        required
                                                    />
                                                    {newUserError && <FieldError>{newUserError}</FieldError>}
                                                </Field>
                                            </FieldGroup>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                            onClick={() => {
                                                setNewUser(emptyNewUser)
                                                setNewUserError("")
                                            }}
                                        >
                                            Discard
                                        </Button>
                                        <Button type="submit" disabled={adding} className="w-full sm:w-auto">
                                            {adding && <Loader2 className="animate-spin" />}
                                            Add user
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        )}

                        {/* Password confirmation (replaces the SweetAlert prompt).
                    Kept outside the forms above so its submit can't bubble into them. */}
                        <Dialog open={confirmOpen} onOpenChange={(open) => !saving && setConfirmOpen(open)}>
                            <DialogContent className="sm:max-w-md">
                                <form onSubmit={handleConfirmSave} className="space-y-4">
                                    <DialogHeader>
                                        <DialogTitle>Enter your password</DialogTitle>
                                        <DialogDescription>
                                            Confirm your current password to save these changes.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <Field data-invalid={Boolean(confirmError)}>
                                        <FieldLabel htmlFor="confirmPass">Current password</FieldLabel>
                                        <PasswordInput
                                            id="confirmPass"
                                            autoComplete="current-password"
                                            autoFocus
                                            placeholder="Enter your password"
                                            aria-invalid={Boolean(confirmError)}
                                            value={confirmPass}
                                            onChange={(e) => {
                                                setConfirmPass(e.target.value)
                                                setConfirmError("")
                                            }}
                                        />
                                        {confirmError && <FieldError>{confirmError}</FieldError>}
                                    </Field>

                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={saving}
                                            onClick={() => setConfirmOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={saving || !confirmPass}>
                                            {saving && <Loader2 className="animate-spin" />}
                                            Confirm
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    )
}