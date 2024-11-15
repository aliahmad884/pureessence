"use client"
// import TinyEditor from "@/components/tinyEditor";
// import dynamic from "next/dynamic";
import Image from "next/image";
// const ProductEditor = dynamic(() => import("@/components/tinyEditor"), { ssr: false });
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function NewProduct() {
    const router = useRouter()
    const params = useSearchParams()
    const pId = params.get('pId')
    const inputFileRef = useRef()
    const [selectedImg, setSelectedImg] = useState([])
    const pInitalState = {
        pName: '',
        slug: '',
        sDesc: '',
        description: '',
        price: '',
        pImages: [],
        qty: 1,
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
        // let result = await res.json()
    }

    const handleCancel = async () => {
        let result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to discard changes!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: 'white',
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, discard!",
            allowOutsideClick: false
        })
        if (result.isConfirmed) {
            router.push('/admin/manage-products')
        }
    }

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
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newP.pImages.length <= 0) {
            alert('Please Provide at least one image')
            return null;
        }
        else if (pId) {
            try {
                let res = await fetch(`/api/product`, {
                    method: 'put',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...newP, id: pId })
                })
                let result = await res.json()
                console.log(result)
                Swal.fire({
                    title: 'Item Updated Successfully!',
                    text: 'The updated item will be displayed on the website after initial load on each device.',
                    icon: 'success',
                    confirmButtonColor: 'white'
                }).then(result => {
                    if (result.isConfirmed) router.push('/admin/manage-products')
                })
            }
            catch (err) {
                console.error(err)
            }
            finally {
                return;
            }
        }
        let res = await fetch('/api/product', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newP)
        })
        if (!res.ok) {
            Swal.fire({
                title: 'Something went wrong!',
                text: 'Please! try again later.',
                icon: 'error',
                confirmButtonColor: 'white'
            })
            setNewP(pInitalState)
            if (inputFileRef) inputFileRef.current.value = ''
            setSelectedImg([])
            return;
        }
        let result = await res.json()
        setNewP(pInitalState)
        if (inputFileRef) inputFileRef.current.value = ''
        setSelectedImg([])
        console.log(result)
        Swal.fire({
            title: 'Item Added Successfully!',
            text: 'The item will be displayed on the website after initial load on each device.',
            icon: 'success',
            confirmButtonColor: 'white'
        })
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                let res = await fetch(`/api/product?pId=${pId}`);
                let result = await res.json()
                setNewP({
                    pName: result.pName,
                    slug: result.slug,
                    sDesc: result.sDesc,
                    description: result.description,
                    price: result.price,
                    pImages: result.pImages,
                    pageTitle: result.pageTitle,
                    metaDesc: result.metaDesc
                })
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


    return (
        <div className="adminRoute">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / <Link style={{ textDecoration: 'underline' }} href="/admin/manage-products">Manage Products</Link> / {pId ? 'Edit Product' : 'New Product'}</p>
                </div>
                <h1>{pId ? 'Edit Product' : 'Add New Product'}</h1>
                <div className="formCont">
                    <form onSubmit={handleSubmit}>
                        <button className="btn submit" type="submit"> Save</button>
                        <button onClick={handleCancel} type="button" className="btn cancel">Cancel</button>
                        <div className="formSec">
                            <h3>Basic Information</h3>
                            <label htmlFor="pName">Product Name</label>
                            <input value={newP.pName} type="text" onChange={(e) => setNewP(prev => ({ ...prev, pName: e.target.value }))} name="pName" id="pName" required placeholder="Product Name" />
                            <br />
                            <label htmlFor="pSlug">Product Url</label>
                            <div className="slug">
                                <input style={{ maxWidth: '280px' }} id="dSlug" value={'https://puressenceltd.co.uk/products/'} type="text" disabled />
                                <input value={newP.slug} type="text" onChange={(e) => setNewP(prev => ({ ...prev, slug: e.target.value }))} name="pSlug" id="pSlug" required placeholder="product-name" />
                            </div>
                            <p>Unique human-readable product identifier. No longer than 255 characters.</p>
                            <br />
                            <label htmlFor="pShortDesc">Short Description</label>
                            <input value={newP.sDesc} type="text" onChange={(e) => setNewP(prev => ({ ...prev, sDesc: e.target.value }))} name="pShortDesc" id="pShortDesc" required placeholder="Short Description" />
                            <br />
                            <label htmlFor="pDesc">Description (optional)</label>
                            <textarea value={newP.description} onChange={(e) => setNewP(prev => ({ ...prev, description: e.target.value }))} name="pDesc" id="pDesc" rows="10" placeholder="write product detailed overview" />
                        </div>
                        <div className="formSec">
                            <h3>Pricing</h3>
                            <label htmlFor="pPrice">Product Price</label>
                            <input value={newP.price} type="text" onChange={(e) => setNewP(prev => ({ ...prev, price: e.target.value }))} name="pPrice" id="pPrice" required placeholder="£10.22" />
                        </div>
                        <div className="formSec">
                            <h3>Images</h3>
                            <div style={{ display: 'flex', flexFlow: 'row wrap', gap: '10px' }}>
                                {
                                    selectedImg.length > 0 && selectedImg.map((img, i) => (

                                        <div key={i} className="thumbnailImg" style={{ backgroundImage: `url('${img}')` }}>
                                            <img title="Delete Image" onClick={() => handleImgDel(i)} className="trashBtn" src="/icons/delete.webp" alt="Trash" width={30} />
                                        </div>
                                    ))
                                }
                            </div>
                            <label htmlFor="pImages">Select Images</label>
                            <input ref={inputFileRef} onChange={(e) => handleImgUpload(e)} type="file" name="pImages" id="pImages" />
                            <p>Select Images one by one of your product.</p>
                        </div>
                        <div className="formSec">
                            <h3>Search engine optimization</h3>
                            <h5>Provide information that will help improve the snippet and bring your product to the top of search engines.</h5>
                            <label htmlFor="pTitle">Page Title</label>
                            <input value={newP.pageTitle} type="text" onChange={(e) => setNewP(prev => ({ ...prev, pageTitle: e.target.value }))} name="pTitle" id="pTitle" required placeholder="Product Page Title" />
                            <br />
                            <label htmlFor="pMetaDesc">Meta Description (optional)</label>
                            <input value={newP.metaDesc} type="text" onChange={(e) => setNewP(prev => ({ ...prev, metaDesc: e.target.value }))} name="pMetaDesc" id="pMetaDesc" placeholder="Product Meta Description" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}