
"use client"

import { useCallback, useEffect, useState } from "react"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { toast } from "sonner"
import {
    ArrowUpRight,
    ClipboardList,
    FileText,
    Loader2,
    Pencil,
    RefreshCw,
    ShoppingBag,
} from "lucide-react"

const orderStatuses = [
    "Processing",
    "Completed",
    "Cancelled",
    "Shipped",
    "Pending"
]

const paymentStatuses = [
    "Pending",
    "Processing",
    "Paid",
    "Refunded",
]

function getShippingDetails(details) {
    if (!details) return {}

    if (typeof details === "string") {
        try {
            return JSON.parse(details)
        } catch {
            return {}
        }
    }

    return details
}

function getStatusVariant(status) {
    switch (status) {
        case "Completed":
        case "Paid":
            return "success"
        case "Processing":
            return "warning"
        case "Canceled":
        case "Refunded":
            return "destructive"
        default:
            return "secondary"
    }
}

function StatusBadge({ status }) {
    const variants = {
        success: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        destructive: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
        secondary: "border-border bg-muted text-muted-foreground",
    }

    const variant = getStatusVariant(status)

    return (
        <Badge
            variant="outline"
            className={variants[variant]}
        >
            {status || "Unknown"}
        </Badge>
    )
}

export default function Orders() {
    const router = useRouter()

    const [orderData, setOrderData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [selectedOrder, setSelectedOrder] = useState(null)
    const [updateStatus, setUpdateStatus] = useState("Processing")
    const [updatePaymentStatus, setUpdatePaymentStatus] = useState("Pending")

    const fetchData = useCallback(async () => {
        setIsLoading(true)

        try {
            const res = await fetch("/api/order")

            if (!res.ok) {
                throw new Error("Unable to fetch orders.")
            }

            const result = await res.json()
            setOrderData(Array.isArray(result) ? result : [])
        } catch (error) {
            console.error("Fetch orders error:", error)
            toast.error("Unable to load orders.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const openEditDialog = (order) => {
        setSelectedOrder(order)
        setUpdateStatus(order.orderStatus || "Processing")
        setUpdatePaymentStatus(order.paymentStatus || "Pending")
    }

    const closeEditDialog = () => {
        if (isSaving) return
        setSelectedOrder(null)
        setUpdateStatus("Processing")
    }

    const handleSave = async () => {
        if (!selectedOrder || isSaving) return

        setIsSaving(true)

        try {
            const params = new URLSearchParams({
                orderId: String(selectedOrder.id),
                status: updateStatus,
            })

            const res = await fetch(`/api/order?${params.toString()}`, {
                method: "PUT",
            })

            if (!res.ok) {
                throw new Error("Order update failed.")
            }

            setOrderData((prev) =>
                prev.map((order) =>
                    order.id === selectedOrder.id
                        ? {
                            ...order,
                            orderStatus: updateStatus
                        }
                        : order
                )
            )

            toast.success("Order updated successfully.")
            setSelectedOrder(null)
        } catch (error) {
            console.error("Update order error:", error)
            toast.error("Unable to update order. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    const formatDate = (date) => {
        if (!date) return "—"

        const parsedDate = new Date(date)

        if (Number.isNaN(parsedDate.getTime())) return "—"

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    const formatTime = (date) => {
        if (!date) return "—"

        const parsedDate = new Date(date)

        if (Number.isNaN(parsedDate.getTime())) return "—"

        return parsedDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatAmount = (amount) => {
        if (amount === undefined || amount === null) return "—"

        return Number(amount).toLocaleString("en-PK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    return (
        <div className="space-y-6 p-4 md:p-6 lg:p-8 adminRoute">
            <div className="subCont">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href="/admin"
                        className="transition-colors hover:text-foreground"
                    >
                        Dashboard
                    </Link>

                    <span>/</span>

                    <span className="font-medium text-foreground">
                        Orders
                    </span>
                </div>

                {/* Page heading */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-5">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Orders
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage customer orders, order progress, and payment status.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={fetchData}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`mr-2 size-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>

                {/* Information */}
                <Card className="border-border/70 bg-muted/30 shadow-none mb-5">
                    <CardContent className="flex gap-3 p-4">
                        <div className="mt-0.5 rounded-lg bg-primary/10 p-2 h-fit">
                            <ClipboardList className="size-4 text-primary" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                Order management
                            </p>

                            <p className="text-sm leading-relaxed text-muted-foreground">
                                You can update an order's status and payment status
                                using the Edit option. To view customer information,
                                products, shipping details, and the complete order,
                                open the order using View Details.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders table */}
                <Card className="overflow-hidden border-border/70 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-lg">
                                All Orders
                            </CardTitle>
                            <CardDescription>
                                {orderData.length} order{orderData.length !== 1 ? "s" : ""} found
                            </CardDescription>
                        </div>

                        <div className="rounded-lg bg-primary/10 p-2">
                            <ShoppingBag className="size-5 text-primary" />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                                        <TableHead className="w-[65px]">#</TableHead>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Order Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead className="text-center">Amount</TableHead>
                                        {/* <TableHead className="text-center">Invoice</TableHead> */}
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="h-32 text-center">
                                                <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Loading orders...
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : orderData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="h-40 text-center">
                                                <ShoppingBag className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                                                <p className="font-medium">No orders found</p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    New orders will appear here.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orderData.map((order, index) => {
                                            const shipping = getShippingDetails(order.shippingDetails)
                                            const customerName = [
                                                shipping.firstName,
                                                shipping.lastName,
                                            ].filter(Boolean).join(" ") || "Unknown customer"

                                            return (
                                                <TableRow key={order.id}>
                                                    <TableCell className="text-muted-foreground">
                                                        {index + 1}
                                                    </TableCell>

                                                    <TableCell className="font-medium">
                                                        {order.order_id}
                                                    </TableCell>

                                                    <TableCell className="min-w-[150px]">
                                                        {customerName}
                                                    </TableCell>

                                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                                        {formatDate(order.orderDate)}
                                                    </TableCell>

                                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                                        {formatTime(order.orderDate)}
                                                    </TableCell>

                                                    <TableCell>
                                                        <StatusBadge status={order.orderStatus} />
                                                    </TableCell>

                                                    <TableCell className={"text-center"}>
                                                        <StatusBadge status={order.payment} />
                                                    </TableCell>

                                                    <TableCell className="whitespace-nowrap text-center font-medium tabular-nums">
                                                        {formatAmount(order.totalAmount)}
                                                    </TableCell>

                                                    {/* <TableCell className="text-center">
                                                        {order.invLink ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Open invoice"
                                                            >
                                                                <a
                                                                    href={order.invLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <FileText className="size-4 text-primary" />
                                                                </a>
                                                            </Button>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">—</span>
                                                        )}
                                                    </TableCell> */}

                                                    <TableCell>
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="gap-1.5"
                                                            >
                                                                <Link href={`/admin/orders/${order.order_id}`} className="flex items-center">
                                                                    View
                                                                    <ArrowUpRight className="size-3.5" />
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-1.5"
                                                                onClick={() => openEditDialog(order)}
                                                            >
                                                                <Pencil className="size-3.5" />
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit order dialog */}
                <Dialog
                    open={Boolean(selectedOrder)}
                    onOpenChange={(open) => {
                        if (!open) closeEditDialog()
                    }}
                >
                    <DialogContent className="sm:max-w-[440px]">
                        <DialogHeader>
                            <DialogTitle>
                                Update Order
                            </DialogTitle>

                            <DialogDescription>
                                Change the order and payment status for order
                                <span className="ml-1 font-semibold text-foreground">
                                    #{selectedOrder?.id}
                                </span>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-5 py-3">

                            {/* Order status */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Order Status
                                </label>

                                <Select
                                    value={updateStatus}
                                    onValueChange={setUpdateStatus}
                                    disabled={isSaving}
                                >
                                    <SelectTrigger className="h-11 w-full">
                                        <SelectValue placeholder="Select order status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {orderStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Payment status */}
                            {/* <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Payment Status
                                </label>

                                <Select
                                    value={updatePaymentStatus}
                                    onValueChange={setUpdatePaymentStatus}
                                    disabled={isSaving}
                                >
                                    <SelectTrigger className="h-11 w-full">
                                        <SelectValue placeholder="Select payment status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {paymentStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div> */}

                            <div className="rounded-lg border bg-muted/30 p-3">
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    Make sure the payment has actually been processed
                                    or refunded through your payment provider before
                                    changing its status here. This field updates your
                                    order record; it does not initiate a transaction.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeEditDialog}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
