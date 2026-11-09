"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAdminContext } from "../adminContext";
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
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function ManageBlogs() {
    const [blogs, setBlogs] = useState([])
    const { isAuthUser } = useAdminContext()
    const [isAuthe, setIsAuth] = useState(true)
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter()
    const pathname = usePathname()
    const [isChecked, setIsChecked] = useState(false)

    const handleDelete = (blog) => {
        setSelectedBlog(blog);
        setDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedBlog) return;

        setIsDeleting(true);

        try {
            const res = await fetch(`/api/blog?id=${selectedBlog.id}`, {
                method: "DELETE",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to delete blog");
            }

            setBlogs((prev) =>
                prev.filter((blog) => blog.id !== selectedBlog.id)
            );

            setDeleteDialog(false);
            setSelectedBlog(null);

            toast.success("Blog deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong!");
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePublishToggle = async (id, checked) => {
        try {
            const res = await fetch("/api/blog", {
                method: 'PUT',
                "Content-Type": "application/json",
                body: JSON.stringify({ id: id, isPublish: checked, reason: "publish_status" })
            })
            if (!res.ok) {
                toast.error("Internal Server Error!")
                return;
            }
            toast.success(`Blog ${checked ? "Published" : "UnPublished"} Successfully!`)
            setBlogs(blog => blog.map(b => b.id === id ? { ...b, publish: checked } : { ...b }))
        }
        catch (err) {
            console.log(err)
            toast.error(err.message || "Something Went Wrong!")
        }
    }

    useEffect(() => {
        fetch('/api/blog').then(res => res.json()).then(result => {
            setBlogs(result)
        }).catch(err => console.error(err))
    }, [])
    return (
        // <div className="adminRoute">
        //     <div className="subCont">
        //         <div className="breadCrumbs">
        //             <p style={{ color: '#888888' }}><Link style={{ textDecoration: 'underline' }} href="/admin">Dashboard</Link> / Manage Blogs</p>
        //         </div>
        //         <h1>Manage Blogs & Guides</h1>
        //         <button onClick={() => router.push('/admin/manage-blogs/blog')} className="btn addNew" type="button"><i className="fi fi-sr-blog-pencil"></i> New Blog</button>
        //         <div className="tableCont">
        //             <table>
        //                 <thead>
        //                     <tr>
        //                         <th style={{ width: '20px', whiteSpace: 'nowrap' }}> <input type="checkbox"  onChange={handleInputState} name="" id="" />&nbsp; Ind.</th>
        //                         <th>Title</th>
        //                         <th>View</th>
        //                         <th>Category</th>
        //                         <th>Published On</th>
        //                         <th>Author</th>
        //                         <th style={{ textAlign: 'center' }}>Action</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {
        //                         blogs && blogs.map((blog, index) => (
        //                             <tr key={blog.id}>
        //                                 <td><input type="checkbox" name="" id="" /> &nbsp;&nbsp; {index + 1}</td>
        //                                 <td >
        //                                     <div className="tableFlex">
        //                                         <img src={`/api/uploadImg?path=${encodeURIComponent(blog.bTitleImg)}`} alt={blog.bTitle} width={50} />
        //                                         <p>{blog.bTitle}</p>
        //                                     </div>
        //                                 </td>
        //                                 <td><Link style={{ color: '#006BFF' }} href={blog.bCategory === 'Blog' ? `/blogs/${blog.bSlug}` : `/blogs/health-guides/${blog.bSlug}`} target="_blank">{blog.bCategory === 'Blog' ? `/blogs/${blog.bSlug}` : `/blogs/health-guides/${blog.bSlug}`}</Link></td>
        //                                 <td>{blog.bCategory}</td>
        //                                 <td>{new Date(blog.date).toDateString()}</td>
        //                                 <td>{blog.bAuthor}</td>
        //                                 <td style={{ justifyContent: 'center' }} className="tableFlex">
        //                                     <Link href={`/admin/manage-blogs/blog?bId=${blog.id}`}><i title="Edit Blog" className="fi fi-sr-pencil"></i></Link>
        //                                     <i style={{cursor:'pointer' ,color:'red'}} className="fi fi-rr-trash-empty" onClick={() => handleDelete(blog.id)} title="Delete Blog"></i>
        //                                 </td>
        //                             </tr>
        //                         ))
        //                     }
        //                 </tbody>
        //             </table>
        //         </div>
        //     </div>
        // </div>
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
                        {" / "} Manage Blogs
                    </p>
                </div>

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Manage Blogs & Guides
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your blog posts and health guides.
                        </p>
                    </div>

                    <Button
                        onClick={() => router.push('/admin/manage-blogs/blog')}
                        className="gap-2"
                    >
                        <i className="fi fi-sr-blog-pencil"></i>
                        New Blog
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-lg bg-background overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-15">Ind.</TableHead>
                                    <TableHead className="min-w-45">Title</TableHead>
                                    <TableHead className="min-w-45">View</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="min-w-32.5">Published On</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead className="text-center">Publish</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {blogs && blogs.length > 0 ? (
                                    blogs.map((blog, index) => (
                                        <TableRow key={blog.id}>

                                            <TableCell className="font-medium text-muted-foreground">
                                                {index + 1}
                                            </TableCell>

                                            {/* Title */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`/api/uploadImg?path=${encodeURIComponent(blog.bTitleImg)}`}
                                                        alt={blog.bTitle}
                                                        className="h-11 w-11 rounded-md object-cover"
                                                    />
                                                    <span className="font-medium text-foreground truncate max-w-50">
                                                        {blog.bTitle}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* View */}
                                            <TableCell>
                                                <Link
                                                    href={
                                                        blog.bCategory === 'Blog'
                                                            ? `/blogs/${blog.bSlug}`
                                                            : `/blogs/health-guides/${blog.bSlug}`
                                                    }
                                                    target="_blank"
                                                    className="text-sm text-blue-600 hover:underline underline-offset-4"
                                                >
                                                    View Post
                                                    <i className="fi fi-rr-arrow-up-right-from-square ml-2 text-xs"></i>
                                                </Link>
                                            </TableCell>

                                            {/* Category */}
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                                                    {blog.bCategory}
                                                </span>
                                            </TableCell>

                                            {/* Published Date */}
                                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                                {new Date(blog.date).toDateString()}
                                            </TableCell>

                                            {/* Author */}
                                            <TableCell className="text-sm">
                                                {blog.bAuthor}
                                            </TableCell>

                                            {/* Publish Toggle */}
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <Switch
                                                    checked={blog.publish}
                                                    onCheckedChange={(checked) =>
                                                        handlePublishToggle(blog.id, checked)
                                                    }
                                                    aria-label={`Toggle publishing for ${blog.bTitle}`}
                                                    />
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-3">
                                                    <Link
                                                        href={`/admin/manage-blogs/blog?bId=${blog.id}`}
                                                        title="Edit Blog"
                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        <i className="fi fi-sr-pencil text-base"></i>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(blog)}
                                                        title="Delete Blog"
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
                                            colSpan={8}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No blogs found.
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

                        if (!open) {
                            setSelectedBlog(null);
                        }
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this blog?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete{" "}
                            <strong>{selectedBlog?.bTitle}</strong>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>

                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Blog"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}