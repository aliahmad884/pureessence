"use client"

import FallBackLoader from "@/components/loader"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataContext } from "@/context"
import {
    Check,
    ChevronRight,
    CircleAlert,
    Copy,
    Eye,
    EyeOff,
    Info,
    Loader2,
    LogOut,
    Package,
    UserRound,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"



const money = (value) =>
    Number(value).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

const formatDate = (value) => {
    if (!value) return ''
    const d = new Date(value)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

const addressLines = (a) =>
    a
        ? [a.address, a.address2, [a.city, a.postcode].filter(Boolean).join(' '), a.country].filter(Boolean)
        : []


const statusStyle = (status) => {
    const s = String(status).toLowerCase()
    if (/(deliver|complete)/.test(s)) return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    if (/(ship|dispatch|transit)/.test(s)) return 'border-sky-500/30 bg-sky-500/10 text-sky-300'
    if (/(cancel|refund|fail)/.test(s)) return 'border-red-500/30 bg-red-500/10 text-red-300'
    return 'border-[#e6b02f]/30 bg-[#e6b02f]/10 text-[#e6b02f]'
}

const itemImage = (item) =>
    `/api/uploadImg?path=${encodeURIComponent(item.pImages ? item.pImages[0] : item.imgUrl)}`

const itemName = (item) => (item.pName ? item.pName : item.title)

const fieldClass =
    "h-12 rounded-xl border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-white/40 " +
    "focus-visible:border-[#e6b02f] focus-visible:ring-[#e6b02f]/30 disabled:opacity-60 " +
    "[&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#222]"

const tabTriggerClass =
    "gap-2 rounded-lg px-4 py-2 text-white/70 " +
    "data-active:border-transparent data-active:bg-[#e6b02f] data-active:text-[#181818] " +
    "dark:data-active:border-transparent dark:data-active:bg-[#e6b02f] dark:data-active:text-[#181818]"

function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle(status)}`}>
            {status}
        </span>
    )
}

export default function Profile() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { loggedUser, setLoggedUser } = useDataContext()

    const tab = searchParams.get('tab') === 'profile' ? 'profile' : 'orders'

    // Profile form
    const [userCred, setUserCred] = useState({ last_name: '', first_name: '', email: '', password: '' })
    const [userInfo, setUserInfo] = useState({
        last_name: "",
        first_name: "",
        email: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleUser, setIsGoogleUser] = useState(false)
    const [showPass, setShowPass] = useState(false)

    // Password confirmation dialog
    const [passDialog, setPassDialog] = useState(false)
    const [currentPass, setCurrentPass] = useState('')
    const [passError, setPassError] = useState('')
    const [saving, setSaving] = useState(false)

    // Orders
    const [orders, setOrders] = useState([])
    const [ordersState, setOrdersState] = useState('loading') // loading | ready | error
    const [selected, setSelected] = useState(null)
    const [sheetOpen, setSheetOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const dirty = useMemo(() => {
        if (!loggedUser) return false
        return (
            userCred.first_name !== (loggedUser.first_name || '') ||
            userCred.last_name !== (loggedUser.last_name || '') ||
            userCred.email !== (loggedUser.email || '') ||
            userCred.password !== ''
        )
    }, [userCred, loggedUser])

    const handleInput = (event) => {
        const { name, value } = event.target
        setUserCred((prev) => ({ ...prev, [name]: value }))
    }

    const changeTab = (value) => {
        router.replace(`/profile?tab=${value}`, { scroll: false })
    }

    const logoutRequest = () =>
        fetch('/api/user?action=logout', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({ req: "Logout Request" })
        })

    const handleSignOut = async () => {
        try {
            await logoutRequest()
            setLoggedUser(null)
            localStorage.removeItem('cart')
            router.push("/")
        } catch (err) {
            console.log(err)
        }
    }

    const openPassDialog = () => {
        setCurrentPass('')
        setPassError('')
        setPassDialog(true)
    }

    const handleUpdateUser = async (event) => {
        event.preventDefault()
        try {
            const update = await fetch('/api/user', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userCred)
            })
            if (!update.ok) {
                // setPassDialog(false)
                toast.error("We couldn't update your details. Please try again.")
                return
            }
            setUserInfo(prev => ({ ...prev, last_name: userCred.last_name, first_name: userCred.first_name }))
            // setPassDialog(false)
            toast.success('Details updated...')
            // await logoutRequest()
            // localStorage.removeItem('cart')
            // setTimeout(() => router.push('/login?retTo=/profile'), 2000)
        } catch (err) {
            console.log(err)
            setPassError('Something went wrong. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const fetchOrders = async () => {
        setOrdersState('loading')
        try {
            const res = await fetch("/api/order?scope=customer")
            if (!res.ok) throw new Error('Orders request failed')
            const result = await res.json();
            setOrders(result.data)
            setOrdersState('ready')
        } catch (err) {
            console.log(err)
            setOrdersState('error')
        }
    }

    const openOrder = (order) => {
        setSelected(order)
        setCopied(false)
        setSheetOpen(true)
    }

    const copyId = async (id) => {
        try {
            await navigator.clipboard.writeText(id)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Couldn't copy the order ID.")
        }
    }

    useEffect(() => {
        if (!loggedUser) {
            router.push('/login?retTo=/profile')
        } else {
            setUserInfo({ first_name: loggedUser.first_name, last_name: loggedUser.last_name, email: loggedUser.email })
            setUserCred({ email: loggedUser.email, first_name: loggedUser.first_name, last_name: loggedUser.last_name, password: loggedUser.password || "" })
            fetchOrders(loggedUser.email)
        }
    }, [])

    if (!loggedUser || isLoading) {
        return <FallBackLoader />
    }

    const initials =
        `${(userInfo?.first_name || '')[0] || ''}${(userInfo?.last_name || '')[0] || ''}`.toUpperCase() ||
        (userInfo?.email || '?')[0].toUpperCase()

    return (
        <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-24 sm:px-6">
            <title></title>
            {/* Header */}
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div
                        aria-hidden="true"
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#e6b02f] text-lg font-semibold text-[#181818]"
                    >
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-2xl font-semibold text-white sm:text-3xl">
                            {userInfo?.first_name ? `Hi, ${userInfo.last_name}` : 'My account'}
                        </h1>
                        <p className="truncate text-sm text-white/60">{loggedUser?.email}</p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignOut}
                    className="h-10 rounded-xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                    <LogOut size={16} aria-hidden="true" />
                    Sign out
                </Button>
            </header>

            <Tabs value={tab} onValueChange={changeTab} className="mt-8 flex-col">
                <TabsList className=" rounded-xl bg-white/[0.06] p-1">
                    <TabsTrigger value="orders" className={tabTriggerClass}>
                        <Package size={16} aria-hidden="true" />
                        Orders
                    </TabsTrigger>
                    <TabsTrigger value="profile" className={tabTriggerClass}>
                        <UserRound size={16} aria-hidden="true" />
                        Profile
                    </TabsTrigger>
                </TabsList>

                {/* Orders */}
                <TabsContent value="orders" className="mt-6">
                    {ordersState === 'loading' && (
                        <div className="space-y-3" aria-busy="true" aria-label="Loading orders">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/[0.06]" />
                            ))}
                        </div>
                    )}

                    {ordersState === 'error' && (
                        <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center">
                            <CircleAlert size={28} className="text-red-300" aria-hidden="true" />
                            <h2 className="mt-3 text-lg font-semibold text-white">We couldn&apos;t load your orders</h2>
                            <p className="mt-1 text-sm text-white/60">Please check your connection and try again.</p>
                            <Button
                                type="button"
                                onClick={() => fetchOrders()}
                                className="mt-5 h-11 rounded-xl bg-[#e6b02f] px-6 font-semibold text-[#181818] hover:bg-[#f0c04d]"
                            >
                                Try again
                            </Button>
                        </div>
                    )}

                    {ordersState === 'ready' && orders.length === 0 && (
                        <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-14 text-center">
                            <Package size={28} className="text-white/40" aria-hidden="true" />
                            <h2 className="mt-3 text-lg font-semibold text-white">No orders yet</h2>
                            <p className="mt-1 text-sm text-white/60">When you place an order, it will show up here.</p>
                            <Link
                                href="/products"
                                className="mt-5 inline-flex h-11 items-center rounded-xl bg-[#e6b02f] px-6 font-semibold text-[#181818] transition hover:bg-[#f0c04d]"
                            >
                                Browse products
                            </Link>
                        </div>
                    )}

                    {ordersState === 'ready' && orders.length > 0 && (
                        <ul className="space-y-3">
                            {orders.map((order, index) => (
                                <li key={order.id || index}>
                                    <button
                                        type="button"
                                        onClick={() => openOrder(order)}
                                        className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-[#e6b02f]/40 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b02f]"
                                    >
                                        <div className="flex shrink-0 -space-x-3">

                                            {order?.product.slice(0, 1).map((item, i) => (
                                                <img
                                                    key={i}
                                                    loading="lazy"
                                                    src={itemImage(item)}
                                                    alt=""
                                                    className="h-12 w-12 rounded-lg border-2 border-[#1e1e1e] object-cover"
                                                />
                                            ))}
                                            {order.product.length > 1 && (
                                                <span className="grid h-12 w-12 place-items-center rounded-lg border-2 border-[#1e1e1e] bg-white/10 text-xs font-medium text-white">
                                                    +{order?.product.length - 1}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <p className="truncate font-medium text-white">
                                                    {order.id ? `Order ${order.order_id}` : 'Order'}
                                                </p>
                                                <StatusBadge status={order.orderStatus} />
                                            </div>
                                            <p className="mt-1 text-sm text-white/60">
                                                {[formatDate(order.orderDate), `${order?.product.length} ${order.product.length === 1 ? 'item' : 'items'}`]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                            </p>
                                        </div>

                                        <p className="font-semibold tabular-nums text-white">&pound;{money(order.totalAmount)}</p>
                                        <ChevronRight size={18} className="shrink-0 text-white/40" aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </TabsContent>

                {/* Profile */}
                <TabsContent value="profile" className="mt-6">
                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-8">
                        <h2 className="text-xl font-semibold text-white">Profile details</h2>
                        <p className="mt-1 text-sm text-white/60">Update your name or password.</p>

                        {isGoogleUser && (
                            <div className="mt-6 flex items-start gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
                                <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                                <span>
                                    You signed up with Google, so your details are managed through your Google account.
                                </span>
                            </div>
                        )}

                        <form
                            onSubmit={handleUpdateUser}
                            className="mt-6 space-y-5"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-white/80">First name</Label>
                                    <Input
                                        id="firstName"
                                        name="first_name"
                                        type="text"
                                        autoComplete="given-name"
                                        disabled={isGoogleUser}
                                        value={userCred.first_name}
                                        onChange={handleInput}
                                        required
                                        className={fieldClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-white/80">Last name</Label>
                                    <Input
                                        id="lastName"
                                        name="last_name"
                                        type="text"
                                        autoComplete="family-name"
                                        disabled={isGoogleUser}
                                        value={userCred.last_name}
                                        onChange={handleInput}
                                        required
                                        className={fieldClass}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white/80">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    disabled={true}
                                    value={userCred.email}
                                    onChange={handleInput}
                                    required
                                    className={fieldClass}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPass" className="text-white/80">New password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPass"
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Leave blank to keep your current password"
                                        disabled={isGoogleUser}
                                        value={userCred.password}
                                        onChange={handleInput}
                                        className={`${fieldClass} pr-12`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        disabled={isGoogleUser}
                                        aria-label={showPass ? 'Hide password' : 'Show password'}
                                        aria-pressed={showPass}
                                        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                                    >
                                        {showPass ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                    </button>
                                </div>
                            </div>

                            {!isGoogleUser && (
                                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-white/50">
                                        For your security, you&apos;ll be asked to sign in again after saving.
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={!dirty}
                                        className="h-12 rounded-xl bg-[#e6b02f] px-8 text-base font-semibold text-[#181818] hover:bg-[#f0c04d] disabled:opacity-50"
                                    >
                                        Save changes
                                    </Button>
                                </div>
                            )}
                        </form>
                    </section>
                </TabsContent>
            </Tabs>

            {/* Order details */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="w-full overflow-y-auto border-white/10 bg-[#1e1e1e] text-white sm:max-w-md">
                    {selected && (
                        <>
                            <SheetHeader>
                                <SheetTitle className="text-xl text-white">
                                    {selected.id ? `Order ${selected.order_id}` : 'Order details'}
                                </SheetTitle>
                                <SheetDescription className="text-white/60">
                                    {formatDate(selected.orderDate) ? `Placed on ${formatDate(selected.orderDate)}` : 'Order details'}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="space-y-6 px-4 pb-6">
                                <div className="flex items-center justify-between gap-3">
                                    <StatusBadge status={selected.orderStatus} />
                                    {selected.id && (
                                        <button
                                            type="button"
                                            onClick={() => copyId(selected.order_id)}
                                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                                        >
                                            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                                            {copied ? 'Copied' : 'Copy order ID'}
                                        </button>
                                    )}
                                </div>

                                <section>
                                    <h3 className="text-sm font-medium uppercase tracking-wide text-[#e6b02f]">Items</h3>
                                    <ul className="mt-3 divide-y divide-white/10">
                                        {selected.product.map((item, i) => (
                                            <li key={item.id || i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                                <img
                                                    loading="lazy"
                                                    src={itemImage(item)}
                                                    alt=""
                                                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="line-clamp-2 text-sm text-white">{itemName(item)}</p>
                                                    <p className="mt-0.5 text-xs text-white/60">
                                                        Qty {item.qty} &times; &pound;{money(item.price)}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-medium tabular-nums text-white">
                                                    &pound;{money(item.qty * item.price)}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <dl className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="text-white/60">Subtotal</dt>
                                            <dd className="tabular-nums">&pound;{money(selected.totalAmount)}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-white/60">Shipping</dt>
                                            <dd className="tabular-nums">&pound;{money(selected.shipFee)}</dd>
                                        </div>
                                        {selected.discount > 0 && (
                                            <div className="flex justify-between">
                                                <dt className="text-white/60">Discount</dt>
                                                <dd className="tabular-nums text-emerald-400">&minus;&pound;{money(selected.discount)}</dd>
                                            </div>
                                        )}
                                        <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                                            <dt className="text-white/80">Total</dt>
                                            <dd className="text-lg font-semibold tabular-nums">&pound;{money(selected.totalAmount)}</dd>
                                        </div>
                                    </dl>
                                </section>

                                {/* {addressLines(selected.info).length > 0 && ( */}
                                <section>
                                    <h3 className="text-sm font-medium uppercase tracking-wide text-[#e6b02f]">Ship to</h3>
                                    <address className="mt-3 space-y-0.5 text-sm not-italic text-white/80">
                                        {(selected.shippingDetails.firstName || selected.shippingDetails.lastName) && (
                                            <p className="text-white">{selected.shippingDetails.firstName} {selected.shippingDetails.lastName}</p>
                                        )}
                                        {addressLines(selected.shippingDetails).map((line, i) => <p key={i}>{line}</p>)}
                                        {selected.shippingDetails.phone && <p className="pt-1">{selected.shippingDetails.phone}</p>}
                                    </address>
                                </section>
                                {/* )} */}

                                {selected.invId && selected.invUrl && (
                                    <Button
                                        type="button"
                                        onClick={() => router.push(`/invoice?invId=${selected.invId}&ul=${selected.invUrl}`)}
                                        className="h-12 w-full rounded-xl bg-[#e6b02f] text-base font-semibold text-[#181818] hover:bg-[#f0c04d]"
                                    >
                                        View invoice
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Confirm current password before saving */}
            {/* <Dialog open={passDialog} onOpenChange={(open) => !saving && setPassDialog(open)}>
                <DialogContent className="border-white/10 bg-[#1e1e1e] text-white sm:max-w-sm">
                    <form onSubmit={handleConfirmPassword} className="space-y-5">
                        <DialogHeader>
                            <DialogTitle>Confirm your password</DialogTitle>
                            <DialogDescription className="text-white/60">
                                Enter your current password to save these changes.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2">
                            <Label htmlFor="currentPass" className="text-white/80">Current password</Label>
                            <Input
                                id="currentPass"
                                type="password"
                                autoComplete="current-password"
                                value={currentPass}
                                onChange={(e) => {
                                    setCurrentPass(e.target.value)
                                    setPassError('')
                                }}
                                className={fieldClass}
                            />
                            {passError && (
                                <p role="alert" className="flex items-start gap-2 text-sm text-red-300">
                                    <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                                    {passError}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={saving}
                                onClick={() => setPassDialog(false)}
                                className="rounded-xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-[#e6b02f] font-semibold text-[#181818] hover:bg-[#f0c04d] disabled:opacity-70"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                                        Saving
                                    </>
                                ) : (
                                    'Confirm and save'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog> */}
        </main>
    )
}
