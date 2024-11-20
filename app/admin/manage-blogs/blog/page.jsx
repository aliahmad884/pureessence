"use client"
import dynamic from "next/dynamic";
const BlogEditor = dynamic(() => import("@/components/tinyEditor"), { ssr: false });
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function NewBlog() {
    const router = useRouter()
    const params = useSearchParams()
    const bId = params.get('bId')
    const inputFileRef = useRef()
    const [selectedImg, setSelectedImg] = useState(null)
    const bInitalState = {
        bTitle: '',
        bSlug: '',
        bShortDesc: '',
        bTitleImg: '',
        bAuthor: '',
        bCategory: 'Blog',
        blogHtml: ''
    }
    const [newB, setNewB] = useState(bInitalState)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewB(prev => ({ ...prev, [name]: value }))
    }
    const handleImgDel = async (index) => {
        if (inputFileRef) {
            inputFileRef.current.value = ''
        };
        let res = await fetch(`/api/uploadImg?path=${selectedImg}`, {
            method: 'delete'
        });
        let result = await res.json();
        if (res.ok) setSelectedImg([]);
        console.log(result);
        setNewB(prev => ({ ...prev, bTitleImg: '' }))
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
        if (selectedImg) {
            await fetch(`/api/uploadImg?path=${selectedImg}`, { method: 'delete' })
        }
        let formData = new FormData()
        formData.append('file', e.target.files[0])
        let res = await fetch('/api/uploadImg?path=blogs', {
            method: 'post',
            body: formData
        })
        let result = await res.json()
        setSelectedImg(result.path)
        setNewB(prev => ({ ...prev, bTitleImg: result.path }))
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        let blogCategory = newB.bCategory ? newB.bCategory : 'Blog';
        if (bId) {
            try {
                let res = await fetch(`/api/blog`, {
                    method: 'put',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...newB, id: bId })
                })
                let result = await res.json()
                console.log(result)
                Swal.fire({
                    title: 'Item Updated Successfully!',
                    text: 'The updated item will be displayed on the website after initial load on each device.',
                    icon: 'success',
                    confirmButtonColor: 'white'
                }).then(result => {
                    if (result.isConfirmed) router.push('/admin/manage-blogs')
                })
            }
            catch (err) {
                console.error(err)
            }
            finally {
                return;
            }
        }
        let res = await fetch('/api/blog', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newB, bCategory: blogCategory })
        })
        if (!res.ok) {
            Swal.fire({
                title: 'Something went wrong!',
                text: 'Please! try again later.',
                icon: 'error',
                confirmButtonColor: 'white'
            })
            // setNewP(pInitalState)
            if (inputFileRef) inputFileRef.current.value = ''
            setSelectedImg([])
            return;
        }
        let result = await res.json()
        // setNewP(pInitalState)
        setNewB(bInitalState)
        if (inputFileRef) inputFileRef.current.value = ''
        setSelectedImg(null)
        console.log(result)
        Swal.fire({
            title: 'Item Added Successfully!',
            text: 'The item will be displayed on the website after initial load on each device.',
            icon: 'success',
            confirmButtonColor: 'white'
        })
    }
    const handleBlogContent = (content) => {
        setNewB(prev => ({ ...prev, blogHtml: content }))
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                let res = await fetch(`/api/blog?bId=${bId}`);
                let result = await res.json()
                setNewB({
                    bTitle: result.bTitle,
                    bSlug: result.bSlug,
                    bShortDesc: result.bShortDesc,
                    bTitleImg: result.bTitleImg,
                    bAuthor: result.bAuthor,
                    bCategory: result.bCategory,
                    blogHtml: result.blogHtml
                })
                setSelectedImg(result.bTitleImg)
            }
            catch (err) {
                console.log('Error from update product API')
                console.error(err)
            }
        }
        if (bId) {
            fetchProduct()
        }
    }, [])


    return (
        <div className="adminRoute">
            <div className="subCont">
                <div className="breadCrumbs">
                    <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / <Link style={{ textDecoration: 'underline' }} href="/admin/manage-blogs">Manage Blogs</Link> / {bId ? 'Edit Blog' : 'New Blog'}</p>
                </div>
                <h1>Publish New Blog</h1>
                <div className="formCont">
                    <form onSubmit={handleSubmit}>
                        <button className="btn submit" type="submit"> Save</button>
                        <button onClick={handleCancel} type="button" className="btn cancel">Cancel</button>
                        <div className="formSec">
                            <h3>Basic Information</h3>
                            <label htmlFor="pName">Blog Title</label>
                            <input value={newB.bTitle} onChange={handleInputChange} type="text" name="bTitle" id="bTitle" required placeholder="Blog Title" />
                            <br />
                            <label htmlFor="bSlug">Blog Url</label>
                            <div className="slug">
                                <input style={{ maxWidth: '280px' }} id="bSlug" value={'https://puressenceltd.co.uk/products/'} type="text" disabled />
                                <input value={newB.bSlug} onChange={handleInputChange} type="text" name="bSlug" id="bSlug" required placeholder="blog-title" />
                            </div>
                            <p>Unique human-readable blog or health guide identifier. No longer than 255 characters.</p>
                            <br />
                            <label htmlFor="bShortDesc">Short Description</label>
                            <input value={newB.bShortDesc} onChange={handleInputChange} type="text" name="bShortDesc" id="bShortDesc" placeholder="Write Short Description about post." required />
                        </div>
                        <div className="formSec">
                            <h3>Placeholder/Title Image</h3>
                            <div style={{ display: 'flex', flexFlow: 'row wrap', gap: '10px' }}>
                                {selectedImg &&
                                    <div className="thumbnailImg" style={{ backgroundImage: `url('/api/uploadImg?path=${encodeURIComponent(selectedImg)}')` }}>
                                        <img title="Delete Image" onClick={() => handleImgDel()} className="trashBtn" src="/iconImgs/delete.webp" alt="Trash" width={30} />
                                    </div>
                                }
                            </div>
                            <label htmlFor="pImages">Select Image</label>
                            <input ref={inputFileRef} onChange={(e) => handleImgUpload(e)} type="file" name="pImages" id="pImages" />
                            <p>Only one image can be selected as title/placeholder. If you try to upload another image, the previously selected image will be automatically deleted.</p>
                        </div>
                        <div className="formSec">
                            <h3>Category and Author</h3>
                            <label htmlFor="bAuthor">Blog Author</label>
                            <input value={newB.bAuthor} onChange={handleInputChange} type="text" name="bAuthor" id="bAuthor" placeholder="Haji Robert" required />
                            <br />
                            <label htmlFor="bCategory">Category</label>
                            <select value={newB.bCategory} onChange={handleInputChange} name="bCategory" id="bCategory">
                                <option value="Blog">Blog</option>
                                <option value="Health-Guide">Health Guide</option>
                            </select>
                        </div>
                        <div className="formSec">
                            <h3>Blog Content</h3>
                            <h5>Please take a moment to enter your content in the editor below, and feel free to customize the layout style to your exact preferences. You can easily upload images, embed links, and utilize a variety of other features to enrich your post.<strong> To unlock the full potential of the editor and ensure an optimal writing experience, we highly recommend using a wide-screen display. Additionally, you can expand the editor to full screen by clicking the &apos;Fullscreen&apos; option in the toolbar&apos;s more options menu (three dots), giving you an even more immersive writing environment.</strong> For further assistance, you can access the help guide directly from the toolbar, where you&apos;ll find useful shortcuts and tips to make the most of the editor</h5>
                            <BlogEditor initValue={newB.blogHtml} onContentChanges={handleBlogContent} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
