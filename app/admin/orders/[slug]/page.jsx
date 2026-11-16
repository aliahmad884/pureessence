
"use client"

import { useCallback, useEffect, use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Separator,
} from "@/components/ui/separator"

import { toast } from "sonner"

import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    Clock3,
    CreditCard,
    FileText,
    Loader2,
    Mail,
    MapPin,
    Package,
    PackageCheck,
    Phone,
    ShoppingBag,
    UserRound,
} from "lucide-react"

function parseData(value) {
    if (!value) return {}

    if (typeof value === "string") {
        try {
            return JSON.parse(value)
        } catch {
            return {}
        }
    }

    return value
}

function StatusBadge({ status }) {
    const styles = {
        Processing:
            "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        Completed:
            "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400",
        Canceled:
            "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
        Paid:
            "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400",
        Refunded:
            "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
        Pending:
            "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    }

    return (
        <Badge
            variant="outline"
            className={styles[status] || "bg-muted text-muted-foreground"}
        >
            {status || "Unknown"}
        </Badge>
    )
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-muted p-2">
                <Icon className="size-4 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="break-words text-sm font-medium">
                    {value || "Not provided"}
                </p>
            </div>
        </div>
    )
}

function formatDate(date) {
    if (!date) return "—"

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) return "—"

    return parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function formatTime(date) {
    if (!date) return "—"

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) return "—"

    return parsed.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    })
}

function money(value) {
    const amount = Number(value)

    if (!Number.isFinite(amount)) return "£0.00"

    return `£${amount.toFixed(2)}`
}

export default function Orders(props) {
    const params = use(props.params)
    const router = useRouter()
    const { slug } = params

    const [order, setOrder] = useState(null)
    const [shipDetails, setShipDetails] = useState({})
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchOrder = useCallback(async () => {
        setIsLoading(true)

        try {
            const res = await fetch(
                `/api/order?order_id=${encodeURIComponent(slug)}`
            )

            if (!res.ok) {
                throw new Error("Unable to fetch order.")
            }

            const result = await res.json()
            const orderData = result.data
            setOrder(orderData)
            setShipDetails(parseData(orderData.shippingDetails))
            setProducts(parseData(orderData.product))
        } catch (error) {
            console.error("Fetch order error:", error)
            toast.error("Unable to load order details.")
            router.replace("/admin/orders")
        } finally {
            setIsLoading(false)
        }
    }, [slug, router])

    useEffect(() => {
        fetchOrder()
    }, [fetchOrder])

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading order details...
                    </p>
                </div>
            </div>
        )
    }

    if (!order) return null

    const subtotal = Number(order.totalAmount) || 0
    const discount = Number(order.discount) || 0
    const shipping = Number(order.shipFee) || 0
    const finalTotal = subtotal - discount + shipping

    const customerName = [
        shipDetails.firstName,
        shipDetails.lastName,
    ].filter(Boolean).join(" ") || "Unknown customer"

    const itemCount = Array.isArray(products)
        ? products.reduce((total, item) => total + (Number(item.qty) || 0), 0)
        : 0

    return (
        <div className="space-y-6 p-4 md:p-6 lg:p-8 adminRoute">
            <div className="subCont">

                {/* Breadcrumb */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href="/admin"
                        className="hover:text-foreground"
                    >
                        Dashboard
                    </Link>

                    <span>/</span>

                    <Link
                        href="/admin/orders"
                        className="hover:text-foreground"
                    >
                        Orders
                    </Link>

                    <span>/</span>

                    <span className="font-medium text-foreground">
                        #{slug}
                    </span>
                </div>

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-2.5">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Order #{slug}
                            </h1>

                            <StatusBadge status={order.orderStatus} />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Review order items, payment, and customer information.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        // asChild
                        className={"w-fit"}
                    >
                        <Link href="/admin/orders" className="flex items-center">
                            <ArrowLeft className="mr-2 size-4" />Back to Orders
                        </Link>
                    </Button>
                </div>

                {/* Overview */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-5">

                    <Card className="shadow-none">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="rounded-xl bg-primary/10 p-3">
                                <CalendarDays className="size-5 text-primary" />
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Order Date
                                </p>
                                <p className="mt-1 text-sm font-semibold">
                                    {formatDate(order.orderDate)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="rounded-xl bg-primary/10 p-3">
                                <Clock3 className="size-5 text-primary" />
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Order Time
                                </p>
                                <p className="mt-1 text-sm font-semibold">
                                    {formatTime(order.orderDate)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="rounded-xl bg-primary/10 p-3">
                                <Package className="size-5 text-primary" />
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Total Items
                                </p>
                                <p className="mt-1 text-sm font-semibold">
                                    {itemCount} Items
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="rounded-xl bg-primary/10 p-3">
                                <CreditCard className="size-5 text-primary" />
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Payment Status
                                </p>
                                <div className="mt-1">
                                    <StatusBadge status={order.payment || "Pending"} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Main content */}
                <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">

                    {/* Left column */}
                    <div className="min-w-0 space-y-6">

                        {/* Products */}
                        <Card className="overflow-hidden shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ShoppingBag className="size-5 text-muted-foreground" />
                                    Order Items
                                </CardTitle>

                                <CardDescription>
                                    Products included in this order.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[550px] text-sm">
                                        <thead>
                                            <tr className="bg-muted/40 text-left text-muted-foreground">
                                                <th className="px-6 py-3 font-medium">
                                                    Product
                                                </th>
                                                <th className="px-4 py-3 text-right font-medium">
                                                    Price
                                                </th>
                                                <th className="px-4 py-3 text-center font-medium">
                                                    Qty
                                                </th>
                                                <th className="px-6 py-3 text-right font-medium">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {Array.isArray(products) && products.map((item, index) => {
                                                const name = item.pName || item.title || "Product"
                                                const image = item.pImages?.[0] || item.imgUrl
                                                const price = Number(item.price) || 0
                                                const qty = Number(item.qty) || 0

                                                return (
                                                    <tr
                                                        key={item.id || index}
                                                        className="last:border-0"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex min-w-[220px] items-center gap-3">
                                                                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                                                                    {image ? (
                                                                        <img
                                                                            src={`/api/uploadImg?path=${encodeURIComponent(image)}`}
                                                                            alt={name}
                                                                            loading="lazy"
                                                                            className="size-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex size-full items-center justify-center">
                                                                            <Package className="size-5 text-muted-foreground" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <p className="font-medium">
                                                                    {name}
                                                                </p>
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                                            {money(price)}
                                                        </td>

                                                        <td className="px-4 py-4 text-center">
                                                            {qty}
                                                        </td>

                                                        <td className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                                                            {money(price * qty)}
                                                        </td>
                                                    </tr>
                                                )
                                            })}

                                            {(!Array.isArray(products) || products.length === 0) && (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="py-12 text-center text-muted-foreground"
                                                    >
                                                        No products found for this order.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial summary */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Order Summary
                                </CardTitle>
                                <CardDescription>
                                    Breakdown of the order amount.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span className="font-medium">
                                        {money(subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">
                                        Discount
                                    </span>
                                    <span className="font-medium text-green-600">
                                        -{money(discount)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">
                                        Shipping Fee
                                    </span>
                                    <span className="font-medium">
                                        {money(shipping)}
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">
                                            Total Amount
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Including shipping and discount
                                        </p>
                                    </div>

                                    <p className="text-2xl font-bold tracking-tight">
                                        {money(finalTotal)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">

                        {/* Customer */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UserRound className="size-5 text-muted-foreground" />
                                    Customer
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <UserRound className="size-6 text-primary" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold">
                                            {customerName}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            Order #{slug}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact details */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Phone className="size-5 text-muted-foreground" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <InfoRow
                                    icon={UserRound}
                                    label="Full Name"
                                    value={customerName}
                                />

                                <InfoRow
                                    icon={Mail}
                                    label="Email Address"
                                    value={shipDetails.email}
                                />

                                <InfoRow
                                    icon={Phone}
                                    label="Phone Number"
                                    value={shipDetails.phone}
                                />
                            </CardContent>
                        </Card>

                        {/* Shipping address */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MapPin className="size-5 text-muted-foreground" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <InfoRow
                                    icon={MapPin}
                                    label="Country"
                                    value={shipDetails.country}
                                />

                                <InfoRow
                                    icon={MapPin}
                                    label="City"
                                    value={shipDetails.city}
                                />

                                <InfoRow
                                    icon={MapPin}
                                    label="Street Address"
                                    value={shipDetails.address}
                                />
                            </CardContent>
                        </Card>

                        {/* Invoice */}
                        {order.invLink && (
                            <Card className="shadow-sm">
                                <CardContent className="flex items-center justify-between gap-3 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-primary/10 p-2.5">
                                            <FileText className="size-5 text-primary" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold">
                                                Order Invoice
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                View or download invoice
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                    >
                                        <a
                                            href={order.invLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Open invoice"
                                        >
                                            <ArrowUpRight className="size-4" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
