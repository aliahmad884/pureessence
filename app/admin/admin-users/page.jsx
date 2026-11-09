
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    Pencil,
    Trash2,
    Save,
    X,
    Loader2,
    Users,
    ShieldCheck,
    Shield,
} from "lucide-react";


export default function RegisteredUsers() {

    const { loggedUser } = useAdminContext();

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditable, setIsEditable] = useState(null);
    const [editingRole, setEditingRole] = useState("");

    const [savingUserId, setSavingUserId] = useState(null);

    // Delete dialog states
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [password, setPassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const canManageUsers = loggedUser?.userRole !== "User";


    // Fetch registered users
    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);

            const res = await fetch("/api/adminAuth");

            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }

            const result = await res.json();
            setUsers(result);

        } catch (err) {
            console.error(err);
            toast.error("Unable to fetch registered users");

        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    // Start editing user role
    const handleEditUser = (user) => {
        setIsEditable(user.id);
        setEditingRole(user.userRole);
    };


    // Discard changes
    const handleDiscard = () => {
        setIsEditable(null);
        setEditingRole("");
    };


    // Save updated role
    const handleSave = async (id) => {

        if (!editingRole) return;

        const previousUsers = users;

        try {
            setSavingUserId(id);

            // Optimistic update
            setUsers(prev =>
                prev.map(user =>
                    user.id === id
                        ? { ...user, userRole: editingRole }
                        : user
                )
            );

            const params = new URLSearchParams({
                action: "updateRole",
                userId: id,
                newRole: editingRole,
            });

            const res = await fetch(`/api/adminAuth?${params}`, {
                method: "PUT",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.res || "Unable to update role");
            }

            toast.success("Role updated successfully", {
                description: result.res,
            });

            setIsEditable(null);
            setEditingRole("");

        } catch (err) {

            // Rollback optimistic update
            setUsers(previousUsers);

            console.error(err);

            toast.error("Role update failed", {
                description: err.message,
            });

        } finally {
            setSavingUserId(null);
        }
    };


    // Open delete dialog
    const handleDeleteUser = (id) => {

        if (loggedUser?.id === id) {
            toast.error("You cannot delete your own account");
            return;
        }

        setDeletingUserId(id);
        setPassword("");
        setDeleteDialog(true);
    };


    // Close delete dialog
    const handleCloseDelete = () => {

        if (isDeleting) return;

        setDeleteDialog(false);
        setDeletingUserId(null);
        setPassword("");
    };


    // Verify password and delete user
    const handleDelete = async (e) => {

        e.preventDefault();

        if (!password.trim()) {
            toast.error("Please enter your password");
            return;
        }

        try {
            setIsDeleting(true);

            const params = new URLSearchParams({
                action: "checkPass",
                userId: loggedUser.id,
                userPass: password,
            });

            const verifyRes = await fetch(`/api/adminAuth?${params}`);

            if (!verifyRes.ok) {
                toast.error("Incorrect password");
                return;
            }

            const deleteParams = new URLSearchParams({
                action: "deleteUser",
                userId: deletingUserId,
            });

            const deleteRes = await fetch(
                `/api/adminAuth?${deleteParams}`,
                { method: "DELETE" }
            );

            if (!deleteRes.ok) {
                throw new Error("Unable to delete user");
            }

            toast.success("User deleted successfully");

            setDeleteDialog(false);
            setDeletingUserId(null);
            setPassword("");

            await fetchUsers();

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
                        {" / "}Admin Users
                    </p>
                </div>


                {/* Page heading */}
                <div className="flex items-center justify-between flex-wrap gap-4">

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Admin Users
                        </h1>

                        <p className="text-sm text-muted-foreground mt-1">
                            Manage registered users and their permissions.
                        </p>
                    </div>

                    <Badge variant="secondary" className="gap-2 px-3 py-1.5">
                        <Users className="h-4 w-4" />
                        {users.length} Users
                    </Badge>

                </div>


                {/* Users Table */}
                <div className="rounded-xl bg-card overflow-hidden">

                    <div className="overflow-x-auto">

                        <Table>

                            <TableHeader>
                                <TableRow>

                                    <TableHead className="w-[70px]">
                                        Ind.
                                    </TableHead>

                                    <TableHead>
                                        Username
                                    </TableHead>

                                    <TableHead>
                                        Email
                                    </TableHead>

                                    <TableHead>
                                        Role
                                    </TableHead>

                                    {canManageUsers && (
                                        <TableHead className="text-center w-[130px]">
                                            Actions
                                        </TableHead>
                                    )}

                                </TableRow>
                            </TableHeader>


                            <TableBody>

                                {isLoading ? (

                                    <TableRow>
                                        <TableCell
                                            colSpan={canManageUsers ? 6 : 5}
                                            className="h-32 text-center"
                                        >
                                            <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Loading users...
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                ) : users.length === 0 ? (

                                    <TableRow>
                                        <TableCell
                                            colSpan={canManageUsers ? 6 : 5}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No registered users found.
                                        </TableCell>
                                    </TableRow>

                                ) : (

                                    users.map((user, i) => {

                                        const isSelf = loggedUser?.id === user.id;
                                        const isEditing = isEditable === user.id;
                                        const isSaving = savingUserId === user.id;

                                        return (

                                            <TableRow key={user.id}>

                                                <TableCell className="text-center text-muted-foreground">
                                                    {i + 1}
                                                </TableCell>


                                                <TableCell className="font-medium whitespace-nowrap">
                                                    {user.username}
                                                    {isSelf && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2 text-xs"
                                                        >
                                                            You
                                                        </Badge>
                                                    )}
                                                </TableCell>


                                                <TableCell>
                                                    {user.email}
                                                </TableCell>


                                                <TableCell>

                                                    {isEditing ? (

                                                        <Select
                                                            value={editingRole}
                                                            onValueChange={setEditingRole}
                                                        >
                                                            <SelectTrigger className="w-[130px]">
                                                                <SelectValue placeholder="Select role" />
                                                            </SelectTrigger>

                                                            <SelectContent>
                                                                <SelectItem value="User">
                                                                    User
                                                                </SelectItem>

                                                                <SelectItem value="admin">
                                                                    Admin
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                    ) : (

                                                        <Badge
                                                            variant={
                                                                user.userRole === "admin"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className="gap-1"
                                                        >
                                                            {user.userRole === "admin" ? (
                                                                <ShieldCheck className="h-3 w-3" />
                                                            ) : (
                                                                <Shield className="h-3 w-3" />
                                                            )}

                                                            {user.userRole}
                                                        </Badge>

                                                    )}

                                                </TableCell>


                                                {canManageUsers && (

                                                    <TableCell>

                                                        <div className="flex items-center justify-center gap-2">

                                                            {isEditing ? (

                                                                <>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-muted-foreground"
                                                                        onClick={handleDiscard}
                                                                        disabled={isSaving}
                                                                        title="Discard changes"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>


                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-green-600 hover:text-green-700"
                                                                        onClick={() => handleSave(user.id)}
                                                                        disabled={isSaving}
                                                                        title="Save changes"
                                                                    >
                                                                        {isSaving ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <Save className="h-4 w-4" />
                                                                        )}
                                                                    </Button>

                                                                </>

                                                            ) : (

                                                                <>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        disabled={isSelf}
                                                                        onClick={() => handleEditUser(user)}
                                                                        title="Edit role"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>


                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                                        disabled={isSelf}
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                        title="Delete user"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>

                                                                </>

                                                            )}

                                                        </div>

                                                    </TableCell>

                                                )}

                                            </TableRow>

                                        );

                                    })

                                )}

                            </TableBody>

                        </Table>

                    </div>

                </div>

            </div>


            {/* Delete User Password Dialog */}
            <Dialog
                open={deleteDialog}
                onOpenChange={(open) => {
                    if (!open) handleCloseDelete();
                }}
            >

                <DialogContent className="sm:max-w-[420px]">

                    <form onSubmit={handleDelete}>

                        <DialogHeader>

                            <DialogTitle>
                                Delete User
                            </DialogTitle>

                            <DialogDescription>
                                This action cannot be undone. Enter your
                                administrator password to confirm deletion
                                of this user.
                            </DialogDescription>

                        </DialogHeader>


                        <div className="py-5 space-y-2">

                            <label
                                htmlFor="adminPassword"
                                className="text-sm font-medium"
                            >
                                Your Password
                            </label>

                            <Input
                                id="adminPassword"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                disabled={isDeleting}
                                required
                            />

                        </div>


                        <DialogFooter>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseDelete}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={isDeleting || !password.trim()}
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

                            </Button>

                        </DialogFooter>

                    </form>

                </DialogContent>

            </Dialog>

        </div>
    );
}
