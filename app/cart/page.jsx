"use client"
import FallBackLoader from "@/components/loader";
import { useDataContext } from "@/context";
import { Lock, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const money = (value) =>
    Number(value).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export default function CartPage() {
    const router = useRouter()
    const { cartData, removeItem, setCartData, isResDelay } = useDataContext()

    useEffect(() => {
        document.title = 'Cart'
    }, [])

    const subTotal = useMemo(
        () => cartData.reduce((sum, item) => sum + Number(item.price) * item.qty, 0),
        [cartData]
    )
    const itemCount = useMemo(
        () => cartData.reduce((sum, item) => sum + item.qty, 0),
        [cartData]
    )

    const changeQty = (id, delta) => {
        setCartData(
            cartData.map((item) =>
                item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
            )
        )
    }

    if (cartData.length <= 0) {
        return (
            <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
                <h1 className="text-3xl font-semibold text-white">Your cart is empty</h1>
                <p className="mt-3 text-white/60">
                    Add a product and it will show up here.
                </p>
                <Link
                    href="/products"
                    className="mt-8 rounded-xl bg-[#e6b02f] px-6 py-3 font-semibold text-[#181818] transition hover:bg-[#f0c04d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b02f]"
                >
                    Browse products
                </Link>
            </main>
        )
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 pt-24 pb-16 sm:px-6">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-semibold text-white sm:text-4xl">Your cart</h1>
                    <p className="mt-1 text-white/60">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                </div>
                <Link
                    href="/products"
                    className="text-sm text-white/70 underline underline-offset-4 transition hover:text-[#e6b02f]"
                >
                    Continue shopping
                </Link>
            </header>

            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
                {/* Items */}
                <ul className="space-y-4">
                    {cartData.map((data) => {
                        const name = data.pName ? data.pName : data.title
                        const img = data.pImages ? data.pImages[0] : data.imgUrl
                        return (
                            <li
                                key={data.id}
                                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:gap-5 sm:p-4"
                            >
                                <Link
                                    href={`/products/${data.slug}`}
                                    target="_blank"
                                    className="shrink-0"
                                    tabIndex={-1}
                                    aria-hidden="true"
                                >
                                    <img
                                        loading="lazy"
                                        src={`/api/uploadImg?path=${encodeURIComponent(img)}`}
                                        alt=""
                                        className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"
                                    />
                                </Link>

                                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <Link
                                                href={`/products/${data.slug}`}
                                                target="_blank"
                                                className="line-clamp-2 font-medium text-white transition hover:text-[#e6b02f]"
                                            >
                                                {name}
                                            </Link>
                                            <p className="mt-1 text-sm text-white/60">
                                                &pound;{money(data.price)} each
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(data.id)}
                                            disabled={isResDelay}
                                            aria-label={`Remove ${name} from cart`}
                                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-red-400 disabled:cursor-wait disabled:opacity-40"
                                        >
                                            <Trash2 size={18} aria-hidden="true" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <div
                                            className="inline-flex items-center rounded-full border border-white/15 bg-black/30"
                                            role="group"
                                            aria-label={`Quantity for ${name}`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => changeQty(data.id, -1)}
                                                disabled={data.qty <= 1}
                                                aria-label="Decrease quantity"
                                                className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
                                            >
                                                <Minus size={14} aria-hidden="true" />
                                            </button>
                                            <span className="min-w-8 text-center text-sm font-medium tabular-nums text-white" aria-live="polite">
                                                {data.qty}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => changeQty(data.id, 1)}
                                                aria-label="Increase quantity"
                                                className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10"
                                            >
                                                <Plus size={14} aria-hidden="true" />
                                            </button>
                                        </div>

                                        <p className="text-lg font-semibold tabular-nums text-white">
                                            &pound;{money(data.price * data.qty)}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>

                {/* Summary */}
                <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 lg:sticky lg:top-24">
                    <h2 className="text-xl font-semibold text-white">Order summary</h2>

                    <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-white/60">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</dt>
                            <dd className="tabular-nums text-white">&pound;{money(subTotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-white/60">Shipping and taxes</dt>
                            <dd className="text-white/60">At checkout</dd>
                        </div>
                    </dl>

                    <div className="my-5 border-t border-white/10" />

                    <div className="flex items-baseline justify-between">
                        <span className="text-white/80">Total</span>
                        <span className="text-2xl font-semibold tabular-nums text-white">
                            &pound;{money(subTotal)}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push('/shipping')}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6b02f] px-6 py-3.5 font-semibold text-[#181818] transition hover:bg-[#f0c04d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6b02f]"
                    >
                        <Lock size={16} aria-hidden="true" />
                        Proceed to checkout
                    </button>

                    <div className="mt-6 border-t border-white/10 pt-5">
                        <p className="text-sm text-white/60">We accept</p>
                        <div className="mt-3 flex items-center gap-2">
                            <Image src="/iconImgs/applePay.webp" alt="Apple Pay" sizes="100vw" style={{ width: '50px', height: 'auto' }} height={0} width={0} />
                            <Image src="/iconImgs/masterCard.webp" alt="Mastercard" sizes="100vw" style={{ width: '50px', height: 'auto' }} height={0} width={0} />
                            <Image src="/iconImgs/visaCard.webp" alt="Visa" sizes="100vw" style={{ width: '50px', height: 'auto' }} height={0} width={0} />
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    )
}
