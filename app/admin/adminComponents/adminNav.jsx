"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminContext } from "../adminContext";

import {
    LayoutDashboard,
    Package,
    Newspaper,
    ShoppingBag,
    Users,
    Settings,
    ShieldCheck,
    ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const generalLinks = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Manage Products",
        href: "/admin/manage-products",
        icon: Package,
    },
    {
        label: "Manage Blogs",
        href: "/admin/manage-blogs",
        icon: Newspaper,
    },
    {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
    },
    {
        label: "Registered Users",
        href: "/admin/registered-users",
        icon: Users,
    },
];

const adminLinks = [
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
    {
        label: "Admin Users",
        href: "/admin/admin-users",
        icon: ShieldCheck,
        adminOnly: true,
    },
];

export default function AdminNav() {

    const { setIsToggled, loggedUser } = useAdminContext();
    const pathname = usePathname();

    const isHidden = pathname.startsWith("/admin/authenticate");

    const isAdmin = loggedUser?.userRole === "admin";

    const handleNavigation = () => {
        const nav = document.querySelector(".adminNavCont");

        nav?.classList.remove("toggleNav");
        setIsToggled(false);
    };

    const isActive = (href) => {
        if (href === "/admin") {
            return pathname === href;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const renderLink = (item) => {

        if (item.adminOnly && !isAdmin) return null;

        const Icon = item.icon;
        const active = isActive(item.href);

        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigation}
                aria-current={active ? "page" : undefined}
                className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5",
                    "text-sm font-medium transition-all duration-200",
                    active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                <Icon
                    className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        active
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                    )}
                />

                <span className="flex-1 truncate">
                    {item.label}
                </span>

                {active && (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                )}
            </Link>
        );
    };


    if (isHidden) return null;


    return (
        <aside
            className={cn(
                "adminNavCont fixed left-0 top-0 z-50",
                "flex h-dvh w-[260px] flex-col",
                "bg-background",
                "transition-transform duration-300 ease-in-out"
            )}
        >

            {/* Logo / Header */}
            <div className="flex h-[76px] shrink-0 items-center justify-between px-5">

                <Link
                    href="/admin"
                    onClick={handleNavigation}
                    className="flex min-w-0 items-center"
                >
                    <img
                        src="/logos/PE-Main-Logo.png"
                        alt="Admin Logo"
                        className="h-auto max-h-10 max-w-[155px] object-contain"
                    />
                </Link>

                <Badge variant="secondary" className="shrink-0">
                    Admin
                </Badge>

            </div>


            {/* Navigation Links */}
            <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">

                {/* General */}
                <div className="mb-6">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        General
                    </p>

                    <div className="space-y-1">
                        {generalLinks.map(renderLink)}
                    </div>

                </div>


                {/* Admin */}
                <div>

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Administration
                    </p>

                    <div className="space-y-1">
                        {adminLinks.map(renderLink)}
                    </div>

                </div>

            </nav>


            {/* <div className="shrink-0  px-5 py-4">

                <div className="flex items-center justify-center">

                    <img
                        src="/logos/apanel.png"
                        alt="aPanel"
                        className="max-h-9 max-w-[130px] object-contain"
                    />

                </div>

                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    Admin Control Panel
                </p>

            </div> */}

        </aside>
    );
}
