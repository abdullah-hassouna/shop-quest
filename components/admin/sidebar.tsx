"use client"

import { cn } from "@/lib/utils";
import {
    BoxIcon,
    Home,
    LineChart,
    Package,
    Settings,
    ShoppingCart,
    User,
    Users,
} from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";


const navigationItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: Home,
        pathname: "dashboard"
    },
    {
        href: "/dashboard/users",
        label: "Users",
        icon: Users,
        pathname: "users"
    },
    {
        href: "/dashboard/products",
        label: "Products",
        icon: Package,
        pathname: "products"
    },
    {
        href: "/dashboard/orders",
        label: "Orders",
        icon: ShoppingCart,
        pathname: "orders"
    },
    {
        href: "/dashboard/categories",
        label: "Categories",
        icon: BoxIcon,
        pathname: "categories"
    },
    {
        href: "/dashboard/analytics",
        label: "Analytics",
        icon: LineChart,
        pathname: "analytics"
    },
];

export const NavigationContent = () => {
    const pathName = usePathname()?.split("/")?.reverse()[0]
    console.log(pathName)
    const isActive = (path: string) => pathName === path

    return (
        <nav className="flex h-full w-full flex-col items-start px-2 text-sm font-medium lg:px-4 space-y-2">
            {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                    <Link
                        key={item.pathname}
                        href={item.href}
                        className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            isActive(item.pathname)
                                ? "bg-muted text-primary shadow-sm"
                                : "text-muted-foreground hover:bg-muted/50"
                        )}
                    >
                        {item.label}
                        <IconComponent className="h-5 w-5" />
                    </Link>
                );
            })}

            <div className="grow pb-16 flex flex-col justify-end">
                <Link
                    key={"settings"}
                    href={'settings'}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all group ",
                        isActive("settings")
                            ? "bg-muted text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted/50"
                    )}
                >
                    <Settings className="h-8 w-8 group-hover:rotate-90 transition-all duration-500" />
                </Link>
            </div>
        </nav>
    );
}