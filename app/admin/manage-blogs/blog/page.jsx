"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BlogEditor = dynamic(
    () => import("@/components/tinyEditor"),
    { ssr: false }
);

const initialBlogState = {
    bTitle: "",
    bSlug: "",
    bShortDesc: "",
    bTitleImg: "",
    bAuthor: "",
    bCategory: "Blog",
    blogHtml: "",
};

export default function NewBlog() {
    const router = useRouter();
    const params = useSearchParams();
    const bId = params.get("bId");

    const inputFileRef = useRef(null);

    const [newB, setNewB] = useState(initialBlogState);
    const [selectedImg, setSelectedImg] = useState(null);

    const [isLoading, setIsLoading] = useState(Boolean(bId));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeletingImage, setIsDeletingImage] = useState(false);

    const [discardDialog, setDiscardDialog] = useState(false);

    useEffect(() => {
        if (!bId) return;

        let isMounted = true;

        const fetchBlog = async () => {
            setIsLoading(true);

            try {
                const res = await fetch(`/api/blog?id=${bId}`);

                if (!res.ok) {
                    throw new Error("Failed to load blog details.");
                }

                const result = await res.json();

                if (!isMounted) return;

                setNewB({
                    bTitle: result.bTitle || "",
                    bSlug: result.bSlug || "",
                    bShortDesc: result.bShortDesc || "",
                    bTitleImg: result.bTitleImg || "",
                    bAuthor: result.bAuthor || "",
                    bCategory: result.bCategory || "Blog",
                    blogHtml: result.blogHtml || "",
                });

                setSelectedImg(result.bTitleImg || null);
            } catch (error) {
                console.error(error);
                toast.error(error.message || "Unable to load blog.");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchBlog();

        return () => {
            isMounted = false;
        };
    }, [bId]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewB((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (value) => {
        setNewB((prev) => ({
            ...prev,
            bCategory: value,
        }));
    };

    const handleBlogContent = (content) => {
        setNewB((prev) => ({
            ...prev,
            blogHtml: content,
        }));
    };

    const handleImgUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const previousImage = selectedImg;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/uploadImg?path=blogs", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok || !result.path) {
                throw new Error(result.message || "Image upload failed.");
            }

            setSelectedImg(result.path);

            setNewB((prev) => ({
                ...prev,
                bTitleImg: result.path,
            }));

            if (previousImage && previousImage !== result.path) {
                try {
                    await fetch(
                        `/api/uploadImg?path=${encodeURIComponent(previousImage)}`,
                        { method: "DELETE" }
                    );
                } catch (error) {
                    console.error("Could not delete previous image:", error);
                }
            }

            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to upload image.");

            if (inputFileRef.current) {
                inputFileRef.current.value = "";
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleImgDel = async () => {
        if (!selectedImg) return;

        setIsDeletingImage(true);

        try {
            const res = await fetch(
                `/api/uploadImg?path=${encodeURIComponent(selectedImg)}`,
                { method: "DELETE" }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to delete image.");
            }

            setSelectedImg(null);

            setNewB((prev) => ({
                ...prev,
                bTitleImg: "",
            }));

            if (inputFileRef.current) {
                inputFileRef.current.value = "";
            }

            toast.success("Image removed successfully.");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Unable to delete image.");
        } finally {
            setIsDeletingImage(false);
        }
    };

    const handleDiscard = () => {
        setDiscardDialog(false);
        router.push("/admin/manage-blogs");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const payload = {
                ...newB,
                bCategory: newB.bCategory || "Blog",
            };

            const res = await fetch("/api/blog", {
                method: bId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    bId ? { ...payload, id: bId } : payload
                ),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result.message || "Something went wrong. Please try again."
                );
            }

            if (bId) {
                toast.success("Blog updated successfully!", {
                    description:
                        "The updated blog will appear on the website after its initial load on each device.",
                });

                router.push("/admin/manage-blogs");
                return;
            }

            toast.success("Blog created successfully!", {
                description:
                    "Your blog has been saved and is ready to be displayed on the website.",
            });

            setNewB(initialBlogState);
            setSelectedImg(null);

            if (inputFileRef.current) {
                inputFileRef.current.value = "";
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="adminRoute">
                <div className="subCont">
                    <div className="flex min-h-64 items-center justify-center">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Loading blog details...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

                        {" / "}

                        <Link
                            href="/admin/manage-blogs"
                            className="underline underline-offset-4 hover:text-foreground"
                        >
                            Manage Blogs
                        </Link>

                        {" / "}

                        <span className="text-foreground">
                            {bId ? "Edit Blog" : "New Blog"}
                        </span>
                    </p>
                </div>

                {/* Page Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {bId ? "Edit Blog" : "Create New Blog"}
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {bId
                                ? "Update your blog post and its content."
                                : "Create and publish a new blog post or health guide."}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDiscardDialog(true)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            form="blog-form"
                            disabled={isSubmitting || isUploading || isDeletingImage}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Saving...
                                </>
                            ) : (
                                bId ? "Update Blog" : "Save Blog"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Blog Form */}
                <form
                    id="blog-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Enter the title, URL and short description of your blog.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            {/* Blog Title */}
                            <div className="space-y-2">
                                <Label htmlFor="bTitle">
                                    Blog Title
                                </Label>

                                <Input
                                    id="bTitle"
                                    name="bTitle"
                                    value={newB.bTitle}
                                    onChange={handleInputChange}
                                    placeholder="Enter blog title"
                                    required
                                />
                            </div>

                            {/* Blog URL */}
                            <div className="space-y-2">
                                <Label htmlFor="bSlug">
                                    Blog URL / Slug
                                </Label>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Input
                                        value="https://puressenceltd.co.uk/blogs/"
                                        disabled
                                        className="max-w-[320px]"
                                    />
                                    <Input
                                        id="bSlug"
                                        name="bSlug"
                                        value={newB.bSlug}
                                        onChange={handleInputChange}
                                        placeholder="blog-title"
                                        required
                                    />
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Use a unique, human-readable identifier.
                                    Maximum 255 characters.
                                </p>
                            </div>

                            {/* Short Description */}
                            <div className="space-y-2">
                                <Label htmlFor="bShortDesc">
                                    Short Description
                                </Label>

                                <Textarea
                                    id="bShortDesc"
                                    name="bShortDesc"
                                    value={newB.bShortDesc}
                                    onChange={handleInputChange}
                                    placeholder="Write a short description about this post."
                                    rows={3}
                                    required
                                />
                            </div>

                        </CardContent>
                    </Card>

                    {/* Title Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Placeholder / Title Image</CardTitle>
                            <CardDescription>
                                Upload the main image that will represent your blog post.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            {selectedImg && (
                                <div className="relative w-fit">
                                    <img
                                        src={`/api/uploadImg?path=${encodeURIComponent(selectedImg)}`}
                                        alt="Blog title image"
                                        className="h-44 w-full max-w-xs rounded-lg border object-cover"
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute right-2 top-2"
                                        onClick={handleImgDel}
                                        disabled={isDeletingImage || isUploading}
                                        title="Delete image"
                                    >
                                        {isDeletingImage ? (
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : (
                                            <i className="fi fi-rr-trash" />
                                        )}
                                    </Button>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="pImages">
                                    {selectedImg ? "Replace Image" : "Select Image"}
                                </Label>

                                <Input
                                    ref={inputFileRef}
                                    id="pImages"
                                    name="pImages"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImgUpload}
                                    disabled={isUploading || isDeletingImage}
                                    className="cursor-pointer"
                                />

                                {isUploading && (
                                    <p className="text-sm text-muted-foreground">
                                        Uploading image...
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Only one title image can be selected. Uploading
                                another image will replace the previously selected image.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Category and Author */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Category and Author</CardTitle>
                            <CardDescription>
                                Choose the blog category and specify its author.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="grid gap-5 sm:grid-cols-2">

                            {/* Author */}
                            <div className="space-y-2">
                                <Label htmlFor="bAuthor">
                                    Blog Author
                                </Label>

                                <Input
                                    id="bAuthor"
                                    name="bAuthor"
                                    value={newB.bAuthor}
                                    onChange={handleInputChange}
                                    placeholder="Enter author name"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="bCategory">
                                    Category
                                </Label>

                                <Select
                                    value={newB.bCategory}
                                    onValueChange={handleCategoryChange}
                                >
                                    <SelectTrigger id="bCategory">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Blog">
                                            Blog
                                        </SelectItem>

                                        <SelectItem value="Health-Guide">
                                            Health Guide
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Blog Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Blog Content</CardTitle>
                            <CardDescription>
                                Write and format the main content of your blog post.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
                                <p>
                                    Use the editor below to create your blog content.
                                    You can customize the layout, upload images,
                                    embed links and use the available formatting tools.
                                </p>

                                <p className="mt-2">
                                    For the best editing experience, we recommend
                                    using a wide-screen display. You can also use
                                    the editor&apos;s Fullscreen option.
                                </p>
                            </div>

                            <div className="min-h-[400px] overflow-hidden rounded-md border">
                                <BlogEditor
                                    initValue={newB.blogHtml}
                                    onContentChanges={handleBlogContent}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Actions */}
                    <div className="flex flex-wrap justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDiscardDialog(true)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting || isUploading || isDeletingImage}
                        >
                            {isSubmitting
                                ? "Saving..."
                                : bId
                                    ? "Update Blog"
                                    : "Save Blog"}
                        </Button>
                    </div>
                </form>

                {/* Discard Confirmation */}
                <AlertDialog
                    open={discardDialog}
                    onOpenChange={setDiscardDialog}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Discard your changes?
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

                            <Button
                                variant="destructive"
                                onClick={handleDiscard}
                            >
                                Discard Changes
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );
}
