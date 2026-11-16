"use client"

import FallBackLoader from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDataContext } from "@/context"
import {
    Check,
    CircleAlert,
    CircleCheck,
    CircleX,
    Clock,
    Copy,
    Loader2,
    Package,
    Search,
    Truck,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const trackEndpoint = (id) => `/api/order?order_id=${encodeURIComponent(id)}`

const money = (value) =>
    Number(value).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

const formatDate = (value) => {
    if (!value) return ''
    const d = new Date(value)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

const toOrderStatus = (raw) => {
    const s = String(raw || '').toLowerCase()
    if (/deliver|complete/.test(s)) return 'Delivered'
    if (/ship|dispatch|transit/.test(s)) return 'Shipped'
    if (/process/.test(s)) return 'Processing'
    if (/cancel|fail/.test(s)) return 'Cancelled'
    return 'Pending'
}

const toPaymentStatus = (o) => {
    const raw = String(o.paymentStatus || o.payment?.status || o.payStatus || '').toLowerCase()
    if (/refund/.test(raw)) return 'Refunded'
    if (/unpaid|pending|fail|due/.test(raw)) return 'Unpaid'
    if (/paid|succe|complete/.test(raw) || o.isPaid === true) return 'Paid'
    return 'Unpaid'
}

const normalizeOrder = (o) => {
    const items = o.product || []
    const subTotal = Number(o.totalAmount ?? 0)
    const shipFee = Number(o.shipFee ?? 0)
    const discount = Number(o.discount ?? 0)
    return {
        id: o.order_id || '',
        date: o.orderDate || null,
        status: o.orderStatus || '',
        payment: o.paymentMethod || 'F',
        items,
        subTotal,
        shipFee,
        discount,
        total: Number(subTotal + shipFee - discount),
        invId: o.invId,
        invUrl: o.invUrl,
        info: o.shippingDetails,
    }
}

const STATUS_META = {
    Pending: {
        icon: Clock,
        text: "We've received your order and it's waiting to be processed.",
        tone: 'border-[#e6b02f]/30 bg-[#e6b02f]/10 text-[#e6b02f]',
    },
    Processing: {
        icon: Package,
        text: "We're preparing your order.",
        tone: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    },
    Shipped: {
        icon: Truck,
        text: 'Your order has been shipped.',
        tone: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    },
    Completed: {
        icon: CircleCheck,
        text: 'Your order has been delivered.',
        tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    },
    Cancelled: {
        icon: CircleX,
        text: 'This order has been cancelled.',
        tone: 'border-red-500/30 bg-red-500/10 text-red-300',
    },
}

const PAYMENT_TONE = {
    Paid: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    Unpaid: 'border-[#e6b02f]/30 bg-[#e6b02f]/10 text-[#e6b02f]',
    Refunded: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
}

const itemImage = (item) =>
    `/api/uploadImg?path=${encodeURIComponent(item.pImages ? item.pImages[0] : item.imgUrl)}`

const itemName = (item) => (item.pName ? item.pName : item.title)

// Guests only need to recognise their order, so private details are partly hidden.
const maskEmail = (email) => {
    if (!email || !email.includes('@')) return ''
    const [name, domain] = email.split('@')
    return `${name[0]}${'*'.repeat(Math.max(2, Math.min(name.length - 1, 5)))}@${domain}`
}

export default function TrackOrder() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const idParam = searchParams.get('id')
    const { loggedUser } = useDataContext()

    const [orderId, setOrderId] = useState(idParam || '')
    const [status, setStatus] = useState('idle') // idle | loading | found | notfound | error
    const [order, setOrder] = useState(null)
    const [isReady, setIsReady] = useState(false)
    const [copied, setCopied] = useState(false)

    const lookup = async (rawId) => {
        const id = rawId.trim()
        if (!id) return
        setStatus('loading')
        setOrder(null)
        try {
            const res = await fetch(trackEndpoint(id))
            if (res.status === 404) {
                setStatus('notfound')
                return
            }
            if (!res.ok) throw new Error('Track request failed')
            const result = await res.json()
            const found = result.data;
            if (!found || (Array.isArray(found) && found.length === 0) || Object.keys(found).length === 0) {
                setStatus('notfound')
                return
            }
            setOrder(normalizeOrder(Array.isArray(found) ? found[0] : found))
            setStatus('found')
        } catch (err) {
            console.log(err)
            setStatus('error')
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const id = orderId.trim()
        if (!id) return
        router.replace(`${pathname}?id=${encodeURIComponent(id)}`, { scroll: false })
        lookup(id)
    }

    const copyId = async (id) => {
        try {
            await navigator.clipboard.writeText(id)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        document.title = 'Track Order | PurEssence'
        if (idParam) lookup(idParam)
        setIsReady(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!isReady) return <FallBackLoader />

    const meta = order ? STATUS_META[order.status] : null
    const StatusIcon = meta ? meta.icon : null
    const info = order ? order.info : null
    const loading = status === 'loading'

    return (
        <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-24 sm:px-6">
            <header>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Track your order</h1>
                <p className="mt-2 text-white/60">
                    Enter your order ID to see your order details and its current status.
                </p>
            </header>

            {/* Lookup */}
            <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
            >
                <Label htmlFor="orderId" className="text-white/80">Order ID</Label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <Input
                            id="orderId"
                            name="orderId"
                            type="text"
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            placeholder="Paste your order ID"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-white/40 focus-visible:border-[#e6b02f] focus-visible:ring-[#e6b02f]/30"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading || !orderId.trim()}
                        className="h-12 rounded-xl bg-[#e6b02f] px-8 text-base font-semibold text-[#181818] hover:bg-[#f0c04d] disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                                Searching
                            </>
                        ) : (
                            'Track order'
                        )}
                    </Button>
                </div>
                <p className="mt-3 text-sm text-white/50">
                    You can find it in your order confirmation and on your invoice.
                </p>
            </form>

            <div aria-live="polite" className="mt-6">
                {/* Not found / error */}
                {(status === 'notfound' || status === 'error') && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5"
                    >
                        <CircleAlert size={22} className="mt-0.5 shrink-0 text-red-300" aria-hidden="true" />
                        <div>
                            <h2 className="font-semibold text-white">
                                {status === 'notfound' ? "We couldn't find that order" : 'Something went wrong'}
                            </h2>
                            <p className="mt-1 text-sm text-white/70">
                                {status === 'notfound'
                                    ? 'Please check the order ID and try again.'
                                    : 'Please check your connection and try again in a moment.'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="space-y-4" aria-busy="true" aria-label="Loading order">
                        <div className="h-40 animate-pulse rounded-2xl bg-white/[0.06]" />
                        <div className="h-48 animate-pulse rounded-2xl bg-white/[0.06]" />
                    </div>
                )}

                {/* Order found */}
                {status === 'found' && order && (
                    <div className="space-y-6">
                        {/* Status */}
                        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm text-white/60">Order ID</p>
                                    <div className="mt-0.5 flex items-center gap-2">
                                        <p className="truncate font-medium text-white">{order.id}</p>
                                        <button
                                            type="button"
                                            onClick={() => copyId(order.id)}
                                            aria-label="Copy order ID"
                                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                                        >
                                            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                                        </button>
                                    </div>
                                    {formatDate(order.date) && (
                                        <p className="mt-1 text-sm text-white/50">Placed on {formatDate(order.date)}</p>
                                    )}
                                </div>
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${PAYMENT_TONE[order.payment]}`}>
                                    {order.payment}
                                </span>
                            </div>

                            <div className={`mt-5 flex items-center gap-4 rounded-xl border p-4 ${meta.tone}`}>
                                <StatusIcon size={28} className="shrink-0" aria-hidden="true" />
                                <div>
                                    <p className="text-xs uppercase tracking-wide opacity-80">Order status</p>
                                    <p className="text-xl font-semibold">{order.status}</p>
                                    <p className="mt-0.5 text-sm text-white/70">{meta.text}</p>
                                </div>
                            </div>
                        </section>

                        {/* Items */}
                        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                            <h2 className="text-lg font-semibold text-white">
                                Items <span className="font-normal text-white/50">({order.items.length})</span>
                            </h2>
                            <ul className="mt-5 divide-y divide-white/10">
                                {order.items.map((item, i) => (
                                    <li key={item.id || i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                        <img
                                            loading="lazy"
                                            src={itemImage(item)}
                                            alt=""
                                            className="h-16 w-16 shrink-0 rounded-xl object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-2 font-medium text-white">{itemName(item)}</p>
                                            <p className="mt-1 text-sm text-white/60">
                                                Qty {item.qty} &times; &pound;{money(item.price)}
                                            </p>
                                        </div>
                                        <p className="font-semibold tabular-nums text-white">
                                            &pound;{money(item.qty * item.price)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Totals and delivery */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                                <h2 className="text-lg font-semibold text-white">Summary</h2>
                                <dl className="mt-4 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-white/60">Subtotal</dt>
                                        <dd className="tabular-nums text-white">&pound;{money(order.subTotal)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-white/60">Shipping</dt>
                                        <dd className="tabular-nums text-white">&pound;{money(order.shipFee)}</dd>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between">
                                            <dt className="text-white/60">Discount</dt>
                                            <dd className="tabular-nums text-emerald-400">&minus;&pound;{money(order.discount)}</dd>
                                        </div>
                                    )}
                                    <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                                        <dt className="text-white/80">Total</dt>
                                        <dd className="text-lg font-semibold tabular-nums text-white">&pound;{money(order.total)}</dd>
                                    </div>
                                </dl>
                            </section>

                            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                                <h2 className="text-lg font-semibold text-white">Delivery</h2>
                                <div className="mt-4 space-y-1 text-sm text-white/80">
                                    {(info.firstName || info.lastName) && (
                                        <p className="text-white">
                                            {info.firstName} {info.lastName ? `${info.lastName[0]}.` : ''}
                                        </p>
                                    )}
                                    {[info.city, info.country].filter(Boolean).length > 0 && (
                                        <p>{[info.city, info.country].filter(Boolean).join(', ')}</p>
                                    )}
                                    {maskEmail(info.email) && (
                                        <p className="pt-2 text-white/60">Confirmation sent to {maskEmail(info.email)}</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {order.invId && order.invUrl && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/invoice?invId=${order.invId}&ul=${order.invUrl}`)}
                                className="h-12 w-full rounded-xl border-white/15 bg-transparent text-base text-white hover:bg-white/10 hover:text-white"
                            >
                                View invoice
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {status === 'idle' && (
                <p className="mt-8 text-center text-sm text-white/50">
                    Have an account?{' '}
                    <Link href="/login?retTo=/profile" className="font-medium text-[#e6b02f] underline-offset-4 hover:underline">
                        Sign in
                    </Link>{' '}
                    to see all your orders in one place.
                </p>
            )}
        </main>
    )
}
