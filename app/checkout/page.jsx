"use client"
import FallBackLoader from "@/components/loader";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDataContext } from "@/context";
import { ChevronRight, CircleCheck, Loader2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from 'react'
import { toast } from "sonner";

const SHIP_FEE = 0
const DISCOUNT = 0

const money = (value) =>
    Number(value).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

// Builds the lines of an address, skipping anything empty (older saved data may not have postcode, etc.)
const addressLines = (a) =>
    a
        ? [a.address, a.address2, [a.city, a.postcode].filter(Boolean).join(' '), a.country].filter(Boolean)
        : []

export default function Checkout() {
    const { setCartData, loggedUser } = useDataContext()
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('sessionId')
    const [cartData, setCart] = useState([])
    const [billingInfo, setBillingInfo] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isConfirming, setIsConfirming] = useState(false)
    const [invUrl, setInvUrl] = useState({
        invId: '',
        invUrl: ''
    })
    const [isOrderConfirmed, setOrderConfirmed] = useState(false)
    const router = useRouter()

    const subTotal = useMemo(
        () => cartData.reduce((sum, item) => sum + Number(item.price) * item.qty, 0),
        [cartData]
    )
    const total = subTotal + SHIP_FEE - DISCOUNT
    const itemCount = useMemo(
        () => cartData.reduce((sum, item) => sum + item.qty, 0),
        [cartData]
    )

    const handleCancel = () => {
        localStorage.removeItem('billingInfo')
        router.push('/cart')
    }

    const emptyCart = async () => {
        localStorage.removeItem('cart')
        setCartData([])
        if (!loggedUser) return;
        try {
            await fetch(`/api/userCart?action=delAll`, {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loggedUser.email })
            })
        }
        catch (err) {
            console.log('Error in removing cart items!')
            console.log(err)
        }
    }

    const handleConfirm = async () => {
        setIsConfirming(true)
        // try {
        //     const res = await fetch('/api/checkout', { method: 'POST' });
        //     const { url } = await res.json();
        //     window.location.href = url; // Redirect to Stripe-hosted page
        // }
        try {
            let body = { ...billingInfo, cartData, subTotal, discount: DISCOUNT, shipFee: SHIP_FEE }
            const res = await fetch('/api/order?reqTyp=invoice', {
                method: 'post',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(body)
            })
            if (res.ok) {
                    const { url } = await res.json();
                    window.location.href = url; // Redirect to Stripe-hosted page
                // const result = await res.json();
                // setOrderConfirmed(true)
                // localStorage.removeItem('uniqueId')
                // localStorage.removeItem('billingInfo')
                // await emptyCart()
                // setInvUrl({
                //     invId: result.invId,
                //     invUrl: result.invUrl
                // })
            }
            else {
                const result = await res.json()
                console.log(result)
                toast.error('Having problem to proceed your order, please try again later.')
            }
        }
        catch (err) {
            toast.error('Internal Server Error!')
            console.log(err)
        }
        finally {
            setIsConfirming(false)
        }
    }

    useEffect(() => {
        let cart = localStorage.getItem('cart')
        let billInfo = localStorage.getItem('billingInfo')
        let sId = localStorage.getItem('sessionId')
        if (!billInfo) {
            return router.push('/products')
        }
        if (sId !== sessionId) {
            // setOrderConfirmed(true)
            localStorage.removeItem("sessionId")
            localStorage.removeItem("billingInfo")
            return router.push("/products")
        }
        setCart(JSON.parse(cart) || [])
        setBillingInfo(JSON.parse(billInfo))
        setIsLoading(false)
    }, [])

    const shipLines = addressLines(billingInfo)
    const billingSeparate = billingInfo.sameAsShipping === false && billingInfo.billing
    const billLines = billingSeparate ? addressLines(billingInfo.billing) : []

    return (
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6">
            <title>Checkout</title>
            {/* Progress */}
            <nav aria-label="Checkout steps" className="mb-8 flex items-center gap-2 text-sm">
                <Link href="/cart" className="text-white/60 transition hover:text-[#e6b02f]">Cart</Link>
                <ChevronRight size={16} className="text-white/30" aria-hidden="true" />
                <Link href="/shipping" className="text-white/60 transition hover:text-[#e6b02f]">Shipping</Link>
                <ChevronRight size={16} className="text-white/30" aria-hidden="true" />
                <span className="font-medium text-[#e6b02f]" aria-current="step">Review</span>
            </nav>

            {isOrderConfirmed ? (
                <div
                    role="status"
                    className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
                >
                    <CircleCheck size={24} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Order confirmed</h1>
                        <p className="mt-1 text-sm text-white/70">
                            Thank you for your order.
                            {invUrl.invId ? ` Your invoice number is ${invUrl.invId}.` : ''}
                        </p>
                    </div>
                </div>
            ) : (
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Review your order</h1>
                    <p className="mt-1 text-white/60">Check the details below, then confirm your order.</p>
                </header>
            )}

            <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
                <div className="space-y-6">
                    {/* Items */}
                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                        <h2 className="text-lg font-semibold text-white">
                            Items <span className="font-normal text-white/50">({itemCount})</span>
                        </h2>
                        <ul className="mt-5 divide-y divide-white/10">
                            {cartData.map((data) => {
                                const name = data.pName ? data.pName : data.title
                                const img = data.pImages ? data.pImages[0] : data.imgUrl
                                return (
                                    <li key={data.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                        <img
                                            loading="lazy"
                                            src={`/api/uploadImg?path=${encodeURIComponent(img)}`}
                                            alt=""
                                            className="h-16 w-16 shrink-0 rounded-xl object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/products/${data.slug}`}
                                                target="_blank"
                                                className="line-clamp-2 font-medium text-white transition hover:text-[#e6b02f]"
                                            >
                                                {name}
                                            </Link>
                                            <p className="mt-1 text-sm text-white/60">
                                                Qty {data.qty} &times; &pound;{money(data.price)}
                                            </p>
                                        </div>
                                        <p className="font-semibold tabular-nums text-white">
                                            &pound;{money(data.qty * data.price)}
                                        </p>
                                    </li>
                                )
                            })}
                        </ul>
                    </section>

                    {/* Delivery and billing details */}
                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold text-white">Delivery details</h2>
                            {!isOrderConfirmed && (
                                <Link
                                    href="/shipping"
                                    className="inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-[#e6b02f]"
                                >
                                    <Pencil size={14} aria-hidden="true" />
                                    Edit
                                </Link>
                            )}
                        </div>

                        <div className="mt-5 grid gap-6 sm:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-wide text-[#e6b02f]">Contact</h3>
                                <p className="mt-2 text-white">{billingInfo.firstName} {billingInfo.lastName}</p>
                                <p className="mt-1 break-words text-sm text-white/70">{billingInfo.email}</p>
                                <p className="mt-1 text-sm text-white/70">{billingInfo.phone}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-wide text-[#e6b02f]">Ship to</h3>
                                <address className="mt-2 space-y-0.5 text-sm not-italic text-white/80">
                                    {shipLines.map((line, i) => <p key={i}>{line}</p>)}
                                </address>
                            </div>
                            <div className="sm:col-span-2">
                                <h3 className="text-sm font-medium uppercase tracking-wide text-[#e6b02f]">Billing address</h3>
                                {billingSeparate ? (
                                    <address className="mt-2 space-y-0.5 text-sm not-italic text-white/80">
                                        {billLines.map((line, i) => <p key={i}>{line}</p>)}
                                    </address>
                                ) : (
                                    <p className="mt-2 text-sm text-white/70">Same as shipping address</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Summary */}
                <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 lg:sticky lg:top-24">
                    <h2 className="text-xl font-semibold text-white">Order summary</h2>

                    <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-white/60">Subtotal</dt>
                            <dd className="tabular-nums text-white">&pound;{money(subTotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-white/60">Shipping</dt>
                            <dd className="tabular-nums text-white">&pound;{money(SHIP_FEE)}</dd>
                        </div>
                        {DISCOUNT > 0 && (
                            <div className="flex justify-between">
                                <dt className="text-white/60">Discount</dt>
                                <dd className="tabular-nums text-emerald-400">&minus;&pound;{money(DISCOUNT)}</dd>
                            </div>
                        )}
                    </dl>

                    <div className="my-5 border-t border-white/10" />

                    <div className="flex items-baseline justify-between">
                        <span className="text-white/80">Total</span>
                        <span className="text-2xl font-semibold tabular-nums text-white">
                            &pound;{money(total)} <span className="text-sm font-normal text-white/50">GBP</span>
                        </span>
                    </div>

                    <div className="mt-6 space-y-3">
                        {isOrderConfirmed ? (
                            <>
                                {invUrl.invId && (
                                    <Button
                                        type="button"
                                        onClick={() => router.push(`/invoice?invId=${invUrl.invId}&ul=${invUrl.invUrl}`)}
                                        className="h-12 w-full rounded-xl bg-[#e6b02f] text-base font-semibold text-[#181818] hover:bg-[#f0c04d]"
                                    >
                                        View invoice
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/products')}
                                    className="h-12 w-full rounded-xl border-white/15 bg-transparent text-base text-white hover:bg-white/10 hover:text-white"
                                >
                                    Back to shopping
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={isConfirming}
                                    className="h-12 w-full rounded-xl bg-[#e6b02f] text-base font-semibold text-[#181818] hover:bg-[#f0c04d] disabled:opacity-70"
                                >
                                    {isConfirming ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                                            Confirming
                                        </>
                                    ) : (
                                        'Confirm order'
                                    )}
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger
                                        disabled={isConfirming}
                                        className="w-full rounded-xl py-2 text-sm text-white/60 transition hover:text-white disabled:opacity-50"
                                    >
                                        Cancel and return to cart
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="border-white/10 bg-[#1e1e1e] text-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Cancel checkout?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-white/60">
                                                Your cart will be kept, but you&apos;ll need to enter your shipping details again.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white">
                                                Keep reviewing
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleCancel}
                                                className="bg-[#e6b02f] font-semibold text-[#181818] hover:bg-[#f0c04d]"
                                            >
                                                Yes, cancel
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    )
}
