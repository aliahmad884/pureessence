"use client"
import FallBackLoader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDataContext } from "@/context";
import { strGen } from "@/options";
import { ChevronDown, ChevronLeft, ChevronRight, Loader2, Lock, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const money = (value) =>
    Number(value).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const fieldClass =
    "h-12 w-full rounded-xl border-white/10 bg-white/[0.04] px-4 text-white placeholder:text-white/40 " +
    "focus-visible:border-[#e6b02f] focus-visible:ring-[#e6b02f]/30 " +
    "[&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#222]";

function Field({ id, label, hint, className = '', ...props }) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id} className="text-white/80">{label}</Label>
            <Input id={id} name={id} className={fieldClass} {...props} />
            {hint && <p className="text-xs text-white/50">{hint}</p>}
        </div>
    )
}

function CountrySelect({ id, label, value, onChange, autoComplete }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-white/80">{label}</Label>
            <div className="relative">
                <select
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    required
                    className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 pr-10 text-sm text-white outline-none transition [color-scheme:dark] focus-visible:border-[#e6b02f] focus-visible:ring-[3px] focus-visible:ring-[#e6b02f]/30 [&>option]:bg-[#1e1e1e]"
                >
                    {/* {countreis.map((c, index) => (
                        <option key={index} value={c.name}>{c.name}</option>
                    ))} */}
                    <option value={"United Kingdom"}>United Kingdom</option>
                </select>
                <ChevronDown aria-hidden="true" size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />
            </div>
        </div>
    )
}

function SummaryBody({ cartData, subTotal }) {
    return (
        <>
            <ul className="space-y-4">
                {cartData.map((item) => {
                    const name = item.pName ? item.pName : item.title
                    const img = item.pImages ? item.pImages[0] : item.imgUrl
                    return (
                        <li key={item.id} className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                <img
                                    loading="lazy"
                                    src={`/api/uploadImg?path=${encodeURIComponent(img)}`}
                                    alt=""
                                    className="h-14 w-14 rounded-lg object-cover"
                                />
                                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#e6b02f] px-1 text-[11px] font-semibold text-[#181818]">
                                    {item.qty}
                                </span>
                            </div>
                            <p className="min-w-0 flex-1 truncate text-sm text-white">{name}</p>
                            <p className="text-sm tabular-nums text-white">&pound;{money(item.price * item.qty)}</p>
                        </li>
                    )
                })}
            </ul>
            <div className="my-5 border-t border-white/10" />
            <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <dt className="text-white/60">Subtotal</dt>
                    <dd className="tabular-nums text-white">&pound;{money(subTotal)}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-white/60">Shipping and taxes</dt>
                    <dd className="text-white/60">Next step</dd>
                </div>
            </dl>
        </>
    )
}

export default function Shipping() {
    const { loggedUser, cartData } = useDataContext()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showAddress2, setShowAddress2] = useState(false)
    const [sameBilling, setSameBilling] = useState(true)
    const [values, setValues] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        city: '',
        postcode: '',
        country: 'United Kingdom',
        phone: '',
    })
    const [billing, setBilling] = useState({
        country: 'United Kingdom',
        address: '',
        city: '',
        postcode: '',
    })

    const subTotal = useMemo(
        () => (cartData || []).reduce((sum, item) => sum + Number(item.price) * item.qty, 0),
        [cartData]
    )

    const setField = (key) => (e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))
    const setBillingField = (key) => (e) => setBilling((prev) => ({ ...prev, [key]: e.target.value }))

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        localStorage.removeItem('billingInfo')
        const sessionId = strGen(25)

        const clean = (v) => v.trim()
        const shipping = {
            address: clean(values.address),
            address2: clean(values.address2),
            city: clean(values.city),
            postcode: clean(values.postcode),
            country: values.country,
        }
        const billingAddress = sameBilling
            ? { address: shipping.address, city: shipping.city, postcode: shipping.postcode, country: shipping.country }
            : { address: clean(billing.address), city: clean(billing.city), postcode: clean(billing.postcode), country: billing.country }

        const body = {
            email: loggedUser ? loggedUser.email : clean(values.email),
            firstName: clean(values.firstName),
            lastName: clean(values.lastName),
            phone: clean(values.phone),
            ...shipping,
            sameAsShipping: sameBilling,
            billing: billingAddress,
        }
        localStorage.setItem('billingInfo', JSON.stringify(body))
        localStorage.setItem('sessionId', sessionId)

        router.push(`/checkout?sessionId=${sessionId}`)
    }

    useEffect(() => {
        document.title = 'Shipping Details'
        // Pre-fill if the person comes back from the next step.
        try {
            const saved = JSON.parse(localStorage.getItem('billingInfo') || 'null')
            if (saved) {
                setValues((prev) => ({
                    ...prev,
                    email: saved.email || '',
                    firstName: saved.firstName || '',
                    lastName: saved.lastName || '',
                    address: saved.address || '',
                    address2: saved.address2 || '',
                    city: saved.city || '',
                    postcode: saved.postcode || '',
                    country: saved.country || prev.country,
                    phone: saved.phone || '',
                }))
                if (saved.address2) setShowAddress2(true)
                if (saved.sameAsShipping === false && saved.billing) {
                    setSameBilling(false)
                    setBilling((prev) => ({ ...prev, ...saved.billing }))
                }
            }
        } catch (e) {
            // ignore unreadable saved data
        }
        setIsLoading(false)
    }, [])

    if (isLoading) return <FallBackLoader />

    const hasItems = cartData && cartData.length > 0

    return (
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6">
            {/* Progress */}
            <nav aria-label="Checkout steps" className="mb-8 flex items-center gap-2 text-sm">
                <Link href="/cart" className="text-white/60 transition hover:text-[#e6b02f]">Cart</Link>
                <ChevronRight size={16} className="text-white/30" aria-hidden="true" />
                <span className="font-medium text-[#e6b02f]" aria-current="step">Shipping</span>
                <ChevronRight size={16} className="text-white/30" aria-hidden="true" />
                <span className="text-white/40">Payment</span>
            </nav>

            {/* Order summary on small screens */}
            {hasItems && (
                <details className="group mb-6 rounded-2xl border border-white/10 bg-white/[0.04] lg:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center gap-2 text-sm font-medium text-white">
                            Order summary
                            <ChevronDown size={16} aria-hidden="true" className="text-white/50 transition group-open:rotate-180" />
                        </span>
                        <span className="font-semibold tabular-nums text-white">&pound;{money(subTotal)}</span>
                    </summary>
                    <div className="border-t border-white/10 px-5 py-5">
                        <SummaryBody cartData={cartData} subTotal={subTotal} />
                    </div>
                </details>
            )}

            <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
                <form
                    id="billingForm"
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-8"
                >
                    <h1 className="text-3xl font-semibold tracking-tight text-white">Shipping details</h1>
                    <p className="mt-1 text-white/60">Where should we send your order?</p>

                    {/* Contact */}
                    <section className="mt-8 space-y-5">
                        <h2 className="text-sm font-medium uppercase tracking-wide text-[#e6b02f]">Contact</h2>
                        <Field
                            id="email"
                            label="Email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            required
                            value={loggedUser?.email || values.email}
                            // readOnly={loggedUser}
                            onChange={setField('email')}
                            hint={loggedUser ? 'Signed in. Your order confirmation will be sent here.' : 'Your order confirmation will be sent here.'}
                        />
                    </section>

                    {/* Shipping address */}
                    <section className="mt-8 space-y-5">
                        <h2 className="text-sm font-medium uppercase tracking-wide text-[#e6b02f]">Shipping address</h2>

                        <CountrySelect
                            id="country"
                            label="Country"
                            value={values.country}
                            onChange={setField('country')}
                            autoComplete="country-name"
                        />

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field id="firstName" label="First name" autoComplete="given-name" required value={values.firstName} onChange={setField('firstName')} />
                            <Field id="lastName" label="Last name" autoComplete="family-name" required value={values.lastName} onChange={setField('lastName')} />
                        </div>

                        <Field id="address" label="Address" autoComplete="address-line1" placeholder="House number and street" required value={values.address} onChange={setField('address')} />

                        {showAddress2 ? (
                            <Field id="address2" label="Apartment, suite, etc. (optional)" autoComplete="address-line2" value={values.address2} onChange={setField('address2')} />
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowAddress2(true)}
                                className="-mt-1 inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-[#e6b02f]"
                            >
                                <Plus size={16} aria-hidden="true" />
                                Add apartment, suite, etc.
                            </button>
                        )}

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field id="city" label="City" autoComplete="address-level2" required value={values.city} onChange={setField('city')} />
                            <Field id="postcode" label="Postcode / ZIP" autoComplete="postal-code" required value={values.postcode} onChange={setField('postcode')} />
                        </div>

                        <Field
                            id="phone"
                            label="Phone"
                            type="tel"
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="For delivery updates"
                            required
                            value={values.phone}
                            onChange={setField('phone')}
                        />
                    </section>

                    {/* Billing address */}
                    <section className="mt-8 space-y-5">
                        <h2 className="text-sm font-medium uppercase tracking-wide text-[#e6b02f]">Billing address</h2>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="sameBilling"
                                checked={sameBilling}
                                onCheckedChange={(checked) => setSameBilling(checked === true)}
                                className="border-white/30 data-[state=checked]:border-[#e6b02f] data-[state=checked]:bg-[#e6b02f] data-[state=checked]:text-[#181818]"
                            />
                            <Label htmlFor="sameBilling" className="cursor-pointer font-normal text-white/80">
                                Same as shipping address
                            </Label>
                        </div>

                        {!sameBilling && (
                            <div className="space-y-5 rounded-xl border border-white/10 bg-black/20 p-4 sm:p-5">
                                <CountrySelect
                                    id="billing-country"
                                    label="Country"
                                    value={billing.country}
                                    onChange={setBillingField('country')}
                                    autoComplete="billing country-name"
                                />
                                <Field id="billing-address" label="Address" autoComplete="billing address-line1" required value={billing.address} onChange={setBillingField('address')} />
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Field id="billing-city" label="City" autoComplete="billing address-level2" required value={billing.city} onChange={setBillingField('city')} />
                                    <Field id="billing-postcode" label="Postcode / ZIP" autoComplete="billing postal-code" required value={billing.postcode} onChange={setBillingField('postcode')} />
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Actions */}
                    <div className="mt-10 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/cart" className="inline-flex items-center justify-center gap-1 text-sm text-white/60 transition hover:text-[#e6b02f]">
                            <ChevronLeft size={16} aria-hidden="true" />
                            Back to cart
                        </Link>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 rounded-xl bg-[#e6b02f] px-8 text-base font-semibold text-[#181818] hover:bg-[#f0c04d] disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                                    One moment
                                </>
                            ) : (
                                'Continue to payment'
                            )}
                        </Button>
                    </div>

                    <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50 sm:justify-end">
                        <Lock size={14} aria-hidden="true" />
                        You won&apos;t be charged yet. Payment is handled securely by Stripe.
                    </p>
                </form>

                {/* Order summary on large screens */}
                {hasItems && (
                    <aside className="hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:sticky lg:top-24 lg:block">
                        <h2 className="mb-5 text-xl font-semibold text-white">Order summary</h2>
                        <SummaryBody cartData={cartData} subTotal={subTotal} />
                    </aside>
                )}
            </div>
        </main>
    )
}
