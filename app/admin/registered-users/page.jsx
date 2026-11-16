
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminContext } from "../adminContext";
import Link from "next/link";
import { toast } from "sonner";

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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    Trash2,
    Loader2,
    Users,
} from "lucide-react";


export default function RegisteredUsers() {

    const { loggedUser } = useAdminContext();

    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const canDelete = loggedUser?.userRole === "admin";


    const formatDate = (date) => {

        if (!date) return "Never";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) return "—";

        return parsedDate.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    const fetchUsers = useCallback(async () => {

        try {

            setIsLoading(true);

            const res = await fetch("/api/user");

            if (!res.ok) {
                throw new Error("Unable to fetch registered users");
            }

            const result = await res.json();
            setUserData(result);

        } catch (err) {

            console.error(err);
            toast.error(err.message);

        } finally {

            setIsLoading(false);

        }

    }, []);


    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    const handleDeleteClick = (user) => {

        setSelectedUser(user);
        setDeleteDialog(true);

    };


    const handleDelete = async () => {

        if (!selectedUser || !canDelete) return;

        try {
            console.log(selectedUser)
            setIsDeleting(true);

            const params = new URLSearchParams({
                userId: selectedUser.Id,
            });

            const res = await fetch(`/api/user?${params}`, {
                method: "DELETE",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result.message || "Unable to delete user"
                );
            }

            setUserData(prev =>
                prev.filter(user => user.Id !== selectedUser.Id)
            );

            toast.success("User deleted successfully");

            setDeleteDialog(false);
            setSelectedUser(null);

        } catch (err) {

            console.error(err);

            toast.error("Delete failed", {
                description: err.message,
            });

        } finally {

            setIsDeleting(false);

        }

    };


    return (

        <div className="adminRoute">

            <div className="subCont space-y-6">

                {/* Breadcrumbs */}
                <div className="breadCrumbs">

                    <p className="text-sm text-muted-foreground">

                        <Link
                            href="/admin"
                            className="underline underline-offset-4"
                        >
                            Dashboard
                        </Link>

                        {" / "}Registered Users

                    </p>

                </div>


                {/* Heading */}
                <div className="flex items-center justify-between flex-wrap gap-4">

                    <div>

                        <h1 className="text-2xl font-semibold tracking-tight">
                            Registered Users
                        </h1>

                        <p className="text-sm text-muted-foreground mt-1">
                            View and manage your website's registered users.
                        </p>

                    </div>

                    <Badge variant="secondary" className="gap-2 px-3 py-1.5">

                        <Users className="h-4 w-4" />

                        {userData.length} Users

                    </Badge>

                </div>


                {/* Users Table */}
                <div className="rounded-xl bg-card overflow-hidden">

                    <div className="overflow-x-auto">

                        <Table>

                            <TableHeader>

                                <TableRow>

                                    <TableHead className="w-[65px]">
                                        Ind.
                                    </TableHead>

                                    <TableHead>
                                        Name
                                    </TableHead>

                                    <TableHead>
                                        Email
                                    </TableHead>

                                    <TableHead className="min-w-[180px]">
                                        Reg. Date
                                    </TableHead>

                                    <TableHead className="min-w-[180px]">
                                        Last Login
                                    </TableHead>

                                    <TableHead>
                                        Registration
                                    </TableHead>

                                    {canDelete && (

                                        <TableHead className="text-center w-[100px]">
                                            Action
                                        </TableHead>

                                    )}

                                </TableRow>

                            </TableHeader>


                            <TableBody>

                                {isLoading ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={canDelete ? 7 : 6}
                                            className="h-32 text-center"
                                        >

                                            <div className="flex justify-center items-center gap-2 text-muted-foreground">

                                                <Loader2 className="h-5 w-5 animate-spin" />

                                                Loading users...

                                            </div>

                                        </TableCell>

                                    </TableRow>

                                ) : userData.length === 0 ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={canDelete ? 7 : 6}
                                            className="h-32 text-center text-muted-foreground"
                                        >

                                            No registered users found.

                                        </TableCell>

                                    </TableRow>

                                ) : (

                                    userData.map((data, i) => (

                                        <TableRow key={data.id}>

                                            <TableCell className="text-center text-muted-foreground">
                                                {i + 1}
                                            </TableCell>


                                            <TableCell className="font-medium whitespace-nowrap">

                                                {data.first_name} {data.last_name}

                                            </TableCell>


                                            <TableCell>
                                                {data.email}
                                            </TableCell>


                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">

                                                {formatDate(data.reg_date)}

                                            </TableCell>


                                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">

                                                {formatDate(data.last_login)}

                                            </TableCell>


                                            <TableCell>

                                                <Badge variant="outline">
                                                    {data.AuthMethod || "Unknown"}
                                                </Badge>

                                            </TableCell>


                                            {canDelete && (

                                                <TableCell>

                                                    <div className="flex justify-center">

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            title="Delete user"
                                                            onClick={() => handleDeleteClick(data)}
                                                        >

                                                            <Trash2 className="h-4 w-4" />

                                                        </Button>

                                                    </div>

                                                </TableCell>

                                            )}

                                        </TableRow>

                                    ))

                                )}

                            </TableBody>

                        </Table>

                    </div>

                </div>

            </div>


            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialog}
                onOpenChange={(open) => {

                    if (!isDeleting) {
                        setDeleteDialog(open);

                        if (!open) {
                            setSelectedUser(null);
                        }
                    }

                }}
            >

                <AlertDialogContent>

                    <AlertDialogHeader>

                        <AlertDialogTitle>
                            Delete Registered User?
                        </AlertDialogTitle>

                        <AlertDialogDescription>

                            Are you sure you want to delete{" "}

                            <span className="font-semibold text-foreground">
                                {selectedUser?.FirstName} {selectedUser?.LastName}
                            </span>

                            ?

                            {" "}This action cannot be undone.

                        </AlertDialogDescription>

                    </AlertDialogHeader>


                    <AlertDialogFooter>

                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>


                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >

                            {isDeleting ? (

                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                </>

                            ) : (

                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                </>

                            )}

                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>

            </AlertDialog>

        </div>

    );

}