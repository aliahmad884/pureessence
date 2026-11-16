"use client"

import dynamic from "next/dynamic";
const ProductEditor = dynamic(() => import("@/components/tinyEditor").then((mod) => mod.ProductEditor), { ssr: false });
import Link from "next/link";
import {useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
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

export default function NewProduct() {
    const validate = /^[0-9]*\.?[0-9]*$/
    const router = useRouter()
    const params = useSearchParams()
    const pId = params.get('pId')
    const inputFileRef = useRef()
    const [selectedImg, setSelectedImg] = useState([])
    const [cancelDialog, setCancelDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pInitalState = {
        pName: '',
        slug: '',
        sDesc: '',
        description: '',
        price: '',
        pImages: [],
        qty: 1,
        status: 'in stock',
        pageTitle: '',
        metaDesc: '',
        reviews: null,
        category: null
    }
    const [newP, setNewP] = useState(pInitalState)
    const handleImgDel = async (index) => {
        let found = selectedImg.filter((_, i) => i !== index)
        setSelectedImg(found)
        if (inputFileRef) {
            inputFileRef.current.value = ''
        }
        setNewP(prev => ({ ...prev, pImages: found }))
        let res = await fetch(`/api/uploadImg?path=${selectedImg[index]}`, {
            method: 'delete'
        })
    }

    const editorContent = (content) => {
        setNewP(prev => ({ ...prev, description: content }))
    }

    const handleCancel = () => {
        setCancelDialog(true);
    };

    const handleImgUpload = async (e) => {
        if (e.target.files.length <= 0) {
            return null;
        }
        let formData = new FormData()
        formData.append('file', e.target.files[0])
        let res = await fetch('/api/uploadImg?path=products', {
            method: 'post',
            body: formData
        })
        let result = await res.json()
        setSelectedImg(prev => [...prev, result.path])
        setNewP(prev => ({ ...prev, pImages: [...prev.pImages, result.path] }))
        console.log(result)
    }
    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     const pStatus = newP.status ? newP.status : 'in stock'
    //     if (newP.pImages.length <= 0) {
    //         alert('Please Provide at least one image')
    //         return null;
    //     }
    //     else if (pId) {
    //         try {
    //             let res = await fetch(`/api/product`, {
    //                 method: 'put',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ ...newP, id: pId })
    //             })
    //             let result = await res.json()
    //             console.log(result)
    //             Swal.fire({
    //                 title: 'Item Updated Successfully!',
    //                 text: 'The updated item will be displayed on the website after initial load on each device.',
    //                 icon: 'success',
    //                 confirmButtonColor: 'white'
    //             }).then(result => {
    //                 if (result.isConfirmed) router.push('/admin/manage-products')
    //             })
    //         }
    //         catch (err) {
    //             console.error(err)
    //         }
    //         finally {
    //             return;
    //         }
    //     }
    //     let res = await fetch('/api/product', {
    //         method: 'post',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ ...newP, status: pStatus })
    //     })
    //     if (!res.ok) {
    //         Swal.fire({
    //             title: 'Something went wrong!',
    //             text: 'Please! try again later.',
    //             icon: 'error',
    //             confirmButtonColor: 'white'
    //         })
    //         setNewP(pInitalState)
    //         if (inputFileRef) inputFileRef.current.value = ''
    //         setSelectedImg([])
    //         return;
    //     }
    //     let result = await res.json()
    //     setNewP(pInitalState)
    //     if (inputFileRef) inputFileRef.current.value = ''
    //     setSelectedImg([])
    //     console.log(result)
    //     Swal.fire({
    //         title: 'Item Added Successfully!',
    //         text: 'The item will be displayed on the website after initial load on each device.',
    //         icon: 'success',
    //         confirmButtonColor: 'white'
    //     })
    // }
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newP.pImages.length <= 0) {
            toast.error("Please provide at least one product image.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/product', {
                method: pId ? 'put' : 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...newP,
                    status: newP.status || 'in stock',
                    ...(pId && { id: pId })
                })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Something went wrong!");
            }

            toast.success(
                pId
                    ? "Product updated successfully!"
                    : "Product added successfully!"
            );

            if (inputFileRef.current) {
                inputFileRef.current.value = '';
            }

            if (pId) {
                router.push('/admin/manage-products');
            } else {
                setNewP(pInitalState);
                setSelectedImg([]);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                let res = await fetch(`/api/product?id=${pId}`);
                let result = await res.json()
                setNewP({...result})
                setSelectedImg(result.pImages)
            }
            catch (err) {
                console.log('Error from update product API')
                console.error(err)
            }
        }
        if (pId) {
            fetchProduct()
        }
    }, [])
    // return (
    //     <div className="adminRoute">
    //         <div className="subCont">
    //             <div className="breadCrumbs">
    //                 <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / <Link style={{ textDecoration: 'underline' }} href="/admin/manage-products">Manage Products</Link> / {pId ? 'Edit Product' : 'New Product'}</p>
    //             </div>
    //             <h1>{pId ? 'Edit Product' : 'Add New Product'}</h1>
    //             <div className="formCont">
    //                 <form onSubmit={handleSubmit}>
    //                     <button className="btn submit" type="submit"> Save</button>
    //                     <button onClick={handleCancel} type="button" className="btn cancel">Cancel</button>
    //                     <div className="formSec">
    //                         <h3>Basic Information</h3>
    //                         <label htmlFor="pName">Product Name</label>
    //                         <input value={newP.pName} type="text" onChange={(e) => setNewP(prev => ({ ...prev, pName: e.target.value }))} name="pName" id="pName" required placeholder="Product Name" />
    //                         <br />
    //                         <label htmlFor="pSlug">Product Url</label>
    //                         <div className="slug">
    //                             <input style={{ maxWidth: '280px' }} id="dSlug" value={'https://puressenceltd.co.uk/products/'} type="text" disabled />
    //                             <input value={newP.slug} type="text" onChange={(e) => setNewP(prev => ({ ...prev, slug: e.target.value }))} name="pSlug" id="pSlug" required placeholder="product-name" />
    //                         </div>
    //                         <p>Unique human-readable product identifier. No longer than 255 characters.</p>
    //                         <br />
    //                         <label htmlFor="pShortDesc">Short Description</label>
    //                         <input value={newP.sDesc} type="text" onChange={(e) => setNewP(prev => ({ ...prev, sDesc: e.target.value }))} name="pShortDesc" id="pShortDesc" required placeholder="Short Description" />
    //                         <br />
    //                         <label htmlFor="pDesc">Description (optional)</label>
    //                         {/* <textarea value={newP.description} onChange={(e) => setNewP(prev => ({ ...prev, description: e.target.value }))} name="pDesc" id="pDesc" rows="10" placeholder="write product detailed overview" /> */}
    //                         <ProductEditor onContentChanges={editorContent} initValue={newP.description} />
    //                     </div>
    //                     <div className="formSec">
    //                         <h3>Pricing</h3>
    //                         <label htmlFor="pPrice">Product Price</label>
    //                         <input disabled={newP.status === 'out of stock' ? true : false} value={newP.price} type="text" onChange={(e) => {
    //                             const value = e.target.value
    //                             if (validate.test(value)) setNewP(prev => ({ ...prev, price: value }))
    //                         }} name="pPrice" id="pPrice" required placeholder="£10.22" />
    //                         <label htmlFor="pStatus">Stock Status</label>
    //                         <select name="pStatus" id="pStatus" value={newP.status} onChange={(e) => setNewP(prev => ({ ...prev, status: e.target.value }))}>
    //                             <option value="in stock">In stock</option>
    //                             <option value="out of stock">Out of Stock</option>
    //                         </select>
    //                     </div>
    //                     <div className="formSec">
    //                         <h3>Images</h3>
    //                         <div style={{ display: 'flex', flexFlow: 'row wrap', gap: '10px' }}>
    //                             {
    //                                 selectedImg.length > 0 && selectedImg.map((img, i) => (

    //                                     <div key={i} className="thumbnailImg" style={{ backgroundImage: `url('/api/uploadImg?path=${encodeURIComponent(img)}')` }}>
    //                                         <img title="Delete Image" onClick={() => handleImgDel(i)} className="trashBtn" src="/iconImgs/delete.webp" alt="Trash" width={30} />
    //                                     </div>
    //                                 ))
    //                             }
    //                         </div>
    //                         <label htmlFor="pImages">Select Images</label>
    //                         <input ref={inputFileRef} onChange={(e) => handleImgUpload(e)} type="file" name="pImages" id="pImages" />
    //                         <p>Select Images one by one of your product.</p>
    //                     </div>
    //                     <div className="formSec">
    //                         <h3>Search engine optimization</h3>
    //                         <h5>Provide information that will help improve the snippet and bring your product to the top of search engines.</h5>
    //                         <label htmlFor="pTitle">Page Title</label>
    //                         <input value={newP.pageTitle} type="text" onChange={(e) => setNewP(prev => ({ ...prev, pageTitle: e.target.value }))} name="pTitle" id="pTitle" required placeholder="Product Page Title" />
    //                         <br />
    //                         <label htmlFor="pMetaDesc">Meta Description (optional)</label>
    //                         <input value={newP.metaDesc} type="text" onChange={(e) => setNewP(prev => ({ ...prev, metaDesc: e.target.value }))} name="pMetaDesc" id="pMetaDesc" placeholder="Product Meta Description" />
    //                     </div>
    //                 </form>
    //             </div>
    //         </div>
    //     </div>
    // )

    return (
        <div className="adminRoute">
            <div className="subCont space-y-6">

                {/* Breadcrumbs */}
                <div className="breadCrumbs">
                    <p className="text-sm text-muted-foreground">
                        <Link href="/admin" className="underline">
                            Dashboard
                        </Link>
                        {" / "}
                        <Link href="/admin/manage-products" className="underline">
                            Manage Products
                        </Link>
                        {" / "}
                        {pId ? "Edit Product" : "New Product"}
                    </p>
                </div>

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {pId ? "Edit Product" : "Add New Product"}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage product details, pricing and images.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            form="product-form"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Product"}
                        </Button>
                    </div>
                </div>

                {/* Form */}
                <form
                    id="product-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Enter the basic details of your product.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            <div className="space-y-2">
                                <Label htmlFor="pName">Product Name</Label>
                                <Input
                                    id="pName"
                                    value={newP.pName}
                                    onChange={(e) =>
                                        setNewP(prev => ({
                                            ...prev,
                                            pName: e.target.value
                                        }))
                                    }
                                    placeholder="Product Name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pSlug">Product URL</Label>

                                <div className="flex flex-wrap gap-2">
                                    <Input
                                        value="https://puressenceltd.co.uk/products/"
                                        disabled
                                        className="max-w-[320px]"
                                    />

                                    <Input
                                        id="pSlug"
                                        value={newP.slug}
                                        onChange={(e) =>
                                            setNewP(prev => ({
                                                ...prev,
                                                slug: e.target.value
                                            }))
                                        }
                                        placeholder="product-name"
                                        required
                                        className="flex-1 min-w-[150px]"
                                    />
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Unique human-readable product identifier.
                                    Maximum 255 characters.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pShortDesc">
                                    Short Description
                                </Label>

                                <Input
                                    id="pShortDesc"
                                    value={newP.sDesc}
                                    onChange={(e) =>
                                        setNewP(prev => ({
                                            ...prev,
                                            sDesc: e.target.value
                                        }))
                                    }
                                    placeholder="Short Description"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>

                                <ProductEditor
                                    onContentChanges={editorContent}
                                    initValue={newP.description}
                                />
                            </div>

                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Inventory</CardTitle>
                            <CardDescription>
                                Manage product price and stock availability.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="grid gap-5 sm:grid-cols-2">

                            <div className="space-y-2">
                                <Label htmlFor="pPrice">Product Price (£)</Label>

                                <Input
                                    id="pPrice"
                                    value={newP.price}
                                    disabled={newP.status === 'out of stock'}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (validate.test(value)) {
                                            setNewP(prev => ({
                                                ...prev,
                                                price: value
                                            }));
                                        }
                                    }}
                                    placeholder="10.22"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Stock Status</Label>

                                <Select
                                    value={newP.status}
                                    onValueChange={(value) =>
                                        setNewP(prev => ({
                                            ...prev,
                                            status: value
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select stock status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="in stock">
                                            In Stock
                                        </SelectItem>

                                        <SelectItem value="out of stock">
                                            Out of Stock
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                            <CardDescription>
                                Upload and manage your product images.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            {selectedImg?.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {selectedImg?.map((img, i) => (
                                        <div
                                            key={i}
                                            className="relative h-28 w-28 overflow-hidden rounded-lg border group"
                                        >
                                            <img
                                                src={`/api/uploadImg?path=${encodeURIComponent(img)}`}
                                                alt={`Product image ${i + 1}`}
                                                className="h-full w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => handleImgDel(i)}
                                                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Delete image"
                                            >
                                                <i className="fi fi-rr-trash-empty text-xs" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="pImages">Upload Image</Label>

                                <Input
                                    ref={inputFileRef}
                                    onChange={handleImgUpload}
                                    type="file"
                                    accept="image/*"
                                    id="pImages"
                                />

                                <p className="text-xs text-muted-foreground">
                                    Select product images one by one.
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Engine Optimization</CardTitle>
                            <CardDescription>
                                Provide information to improve your product's
                                appearance in search engine results.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            <div className="space-y-2">
                                <Label htmlFor="pTitle">Page Title</Label>

                                <Input
                                    id="pTitle"
                                    value={newP.pageTitle}
                                    onChange={(e) =>
                                        setNewP(prev => ({
                                            ...prev,
                                            pageTitle: e.target.value
                                        }))
                                    }
                                    placeholder="Product Page Title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pMetaDesc">
                                    Meta Description (Optional)
                                </Label>

                                <Input
                                    id="pMetaDesc"
                                    value={newP.metaDesc}
                                    onChange={(e) =>
                                        setNewP(prev => ({
                                            ...prev,
                                            metaDesc: e.target.value
                                        }))
                                    }
                                    placeholder="Product Meta Description"
                                />
                            </div>

                        </CardContent>
                    </Card>

                    {/* Bottom Actions */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Product"}
                        </Button>
                    </div>

                </form>

                {/* Cancel Confirmation */}
                <AlertDialog
                    open={cancelDialog}
                    onOpenChange={setCancelDialog}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Discard changes?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                Are you sure you want to leave this page?
                                Any unsaved changes will be lost.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Continue Editing
                            </AlertDialogCancel>

                            <AlertDialogAction
                                onClick={() =>
                                    router.push('/admin/manage-products')
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Yes, Discard
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );

}