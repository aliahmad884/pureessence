"use client"
// import TinyEditor from "@/components/tinyEditor";
import dynamic from "next/dynamic";
const ProductEditor = dynamic(() => import("@/components/tinyEditor"), { ssr: false });
import Link from "next/link";

export default function NewProduct() {
    return (
        <div className="adminRoute">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link href="/admin">Dashboard</Link> / <Link href="/admin/manage-products">Products</Link> / Add Product</p>
                </div>
                <h1>Add New Product</h1>
                <div className="formCont">
                    <form>
                        <button className="btnSubmit" type="submit"><img src="/icons/save.webp" alt="Save Icon" width={25} /> Save</button>
                        <div className="formSec">
                            <h3>Basic Information</h3>
                            <label htmlFor="pName">Product Name</label>
                            <input type="text" name="pName" id="pName" required placeholder="Product Name" />
                            <br />
                            <label htmlFor="pSlug">Product Url</label>
                            <div className="slug">
                                <input style={{ maxWidth: '280px' }} id="dSlug" value={'https://puressenceltd.co.uk/products/'} type="text" disabled />
                                <input type="text" name="pSlug" id="pSlug" required placeholder="product-name" />
                            </div>
                            <p>Unique human-readable product identifier. No longer than 255 characters.</p>
                            <br />
                            <ProductEditor />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}