"use client";

import { useEffect, useState } from "react";
import { useAdminContext } from "../adminContext";
import { usePathname, useRouter } from "next/navigation";

// shadcn components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

// lucide icons
import {
    Menu,
    UserRound,
    LogOut,
    ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminToolbar() {
    const pathName = usePathname();
    const router = useRouter();

    const {
        isAuthUser,
        setIsAuthUser,
        isToggled,
        setIsToggled,
        loggedUser
    } = useAdminContext();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleNav = () => {
        setIsToggled(true);

        const nav = document.querySelector(".adminNavCont");
        nav?.classList.add("toggleNav");
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;

        try {
            setIsLoggingOut(true);

            const res = await fetch("/api/adminAuth?action=logout", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                toast.error("Logout failed!", {
                    description: "Unable to logout. Please try again.",
                });
                return;
            }

            setIsAuthUser(false);

            toast.success("Logged out successfully!");

            router.replace("/admin/authenticate");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);

            toast.error("Something went wrong!", {
                description: "Please try logging out again.",
            });
        } finally {
            setIsLoggingOut(false);
        }
    };

    useEffect(() => {
        const nav = document.querySelector(".adminNavCont");

        const handleClickOutside = (event) => {
            if (
                isToggled &&
                nav &&
                !nav.contains(event.target) &&
                !event.target.closest(".adminMenuToggle")
            ) {
                nav.classList.remove("toggleNav");
                setIsToggled(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isToggled, setIsToggled]);

    if (pathName.startsWith("/admin/authenticate")) {
        return null;
    }

    const username = loggedUser?.username || "Guest";

    const initials = username
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="adminToolCont flex items-center justify-between px-2 py-1">
            {/* Left: Navigation toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="adminMenuToggle"
                onClick={handleNav}
                aria-label="Toggle navigation"
            >
                <Menu className="h-5 w-5" />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            className="h-auto gap-3 rounded-xl px-3 py-2 hover:bg-muted"
                        />
                    }
                >
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage
                            src={loggedUser?.proImg || "/iconImgs/user.png"}
                            alt={username}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold leading-none">{username}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Administrator</p>
                    </div>

                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{username}</p>
                                <p className="text-xs text-muted-foreground">
                                    Manage your account
                                </p>
                            </div>
                        </DropdownMenuLabel>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => router.push("/admin/settings")}
                        className="cursor-pointer"
                    >
                        <UserRound className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}