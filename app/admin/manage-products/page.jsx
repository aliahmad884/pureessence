
"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const router = useRouter();
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;

        setIsDeleting(true);

        try {
            const res = await fetch(
                `/api/product?id=${selectedProduct.id}`,
                { method: 'DELETE' }
            );

            const response = await res.json();

            if (!res.ok) {
                throw new Error(
                    response.message || "Failed to delete product"
                );
            }

            setProducts(prev =>
                prev.filter(p => p.id !== selectedProduct.id)
            );

            setDeleteDialog(false);
            setSelectedProduct(null);

            toast.success("Product deleted successfully!");

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong!");

        } finally {
            setIsDeleting(false);
        }
    };

    const handlePublishToggle = async (id, checked) => {
        try {
            const res = await fetch("/api/product", {
                method: 'PUT',
                "Content-Type": "application/json",
                body: JSON.stringify({ id: id, isPublish: checked, reason: "publish_status" })
            })
            if (!res.ok) {
                toast.error("Internal Server Error!")
                return;
            }
            toast.success(`Product ${checked?"Published":"UnPublished"} Successfully!`)
            setProducts(product => product.map(p => p.id === id ? { ...p, publish: checked } : { ...p }))
        }
        catch (err) {
            console.log(err)
            toast.error(err.message || "Something Went Wrong!")
        }
    }

    const fetchProducts=async ()=>{
        try{
            const res=await fetch('/api/product');
            const result=await res.json();
            if(!res.ok){
                console.log(error)
                toast.error("Something went wrong!")
            }
            setProducts(result);
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, []);

    return (
        <div className="adminRoute">
            <div className="subCont space-y-6">

                {/* Breadcrumbs */}
                <div className="breadCrumbs">
                    <p className="text-sm text-muted-foreground">
                        <Link
                            href="/admin"
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            Dashboard
                        </Link>
                        {" / "} Manage Products
                    </p>
                </div>

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Manage Products
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your store products and inventory.
                        </p>
                    </div>

                    <Button
                        onClick={() => router.push('/admin/manage-products/product')}
                        className="gap-2"
                    >
                        <i className="fi fi-sr-add"></i>
                        Add Product
                    </Button>
                </div>

                {/* Products Table */}
                <div className="overflow-hidden rounded-lg bg-background">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-15">
                                        Ind.
                                    </TableHead>

                                    <TableHead className="min-w-62.5">
                                        Product
                                    </TableHead>

                                    <TableHead>
                                        Status
                                    </TableHead>

                                    <TableHead>
                                        Price
                                    </TableHead>

                                    <TableHead className="min-w-45">
                                        View
                                    </TableHead>
                                    <TableHead className="text-center">Publish</TableHead>
                                    <TableHead className="text-center">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {products.length > 0 ? (
                                    products.map((p, i) => (
                                        <TableRow key={p.id}>

                                            {/* Index */}
                                            <TableCell className="font-medium text-muted-foreground">
                                                {i + 1}
                                            </TableCell>

                                            {/* Product */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`/api/uploadImg?path=${encodeURIComponent(p.pImages[0])}`}
                                                        alt={p.pName}
                                                        className="h-11 w-11 rounded-md object-cover"
                                                    />

                                                    <span className="font-medium text-foreground line-clamp-2">
                                                        {p.pName}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium capitalize ${p.status === 'out of stock'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                                                        : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                                                        }`}
                                                >
                                                    <span
                                                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${p.status === 'out of stock'
                                                            ? 'bg-red-600'
                                                            : 'bg-green-600'
                                                            }`}
                                                    />
                                                    {p.status}
                                                </span>
                                            </TableCell>

                                            {/* Price */}
                                            <TableCell className="font-medium whitespace-nowrap">
                                                £{p.price}
                                            </TableCell>

                                            {/* View */}
                                            <TableCell>
                                                <Link
                                                    href={`/products/${p.slug}`}
                                                    target="_blank"
                                                    className="text-sm text-blue-600 hover:underline underline-offset-4"
                                                >
                                                    View Product
                                                    <i className="fi fi-rr-arrow-up-right-from-square ml-2 text-xs"></i>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <Switch
                                                        checked={p.publish}
                                                        onCheckedChange={(checked) =>
                                                            handlePublishToggle(p.id, checked)
                                                        }
                                                        aria-label={`Toggle publishing for ${p.pName}`}
                                                    />
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-3">
                                                    <Link
                                                        href={`/admin/manage-products/product?pId=${p.id}`}
                                                        title="Edit Product"
                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        <i className="fi fi-sr-pencil text-base"></i>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(p)}
                                                        title="Delete Product"
                                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                                    >
                                                        <i className="fi fi-rr-trash-empty text-base"></i>
                                                    </button>
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
            <AlertDialog
                open={deleteDialog}
                onOpenChange={(open) => {
                    if (!isDeleting) {
                        setDeleteDialog(open);
                        if (!open) setSelectedProduct(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete{" "}
                            <strong>{selectedProduct?.pName}</strong>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete Product"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
