"use client"

import getUserSession from '@/actions/auth/regisreation/get-user-session';
import { redirect, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Bell,
    Home,
    LineChart,
    Package,
    Package2,
    ShoppingCart,
    User,
    Users,
    BarChart3,
    Menu,
    X
} from "lucide-react"
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Navigation items configuration
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
        icon: User,
        pathname: "users"
    },
    {
        href: "/dashboard/products",
        label: "Products", // Fixed typo from "Porducts"
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
        href: "/dashboard/customers",
        label: "Customers",
        icon: Users,
        pathname: "customers"
    },
    {
        href: "/dashboard/analytics",
        label: "Analytics",
        icon: LineChart,
        pathname: "analytics"
    }
];

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname()?.split('/').pop() || 'dashboard';

    useEffect(() => {
        const getCurrentUserRole = async () => {
            try {
                const { success, sessionExpired, userData } = await getUserSession();

                if (!success || sessionExpired || !userData) {
                    redirect('/');
                    return;
                }

                if (!userData.role.startsWith('ADMIN')) {
                    redirect('/');
                    return;
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user session:", error);
                redirect('/');
            }
        };

        getCurrentUserRole();
    }, []);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const NavigationContent = () => (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
            {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.pathname;

                return (
                    <Link
                        key={item.pathname}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            isActive
                                ? "bg-muted text-primary shadow-sm"
                                : "text-muted-foreground hover:bg-muted/50"
                        )}
                    >
                        <IconComponent className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar */}
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    {/* Header */}
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span>Admin UI</span>
                        </Link>
                        <Button
                            variant="outline"
                            size="icon"
                            className="ml-auto h-8 w-8 bg-transparent"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-auto py-2">
                        <NavigationContent />
                    </div>
                </div>
            </div>

            {/* Mobile Header & Content */}
            <div className="flex flex-col">
                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden lg:h-[60px] lg:px-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="h-8 w-8"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Menu className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>

                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span>Admin UI</span>
                    </Link>

                    <Button
                        variant="outline"
                        size="icon"
                        className="ml-auto h-8 w-8"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </header>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="border-b bg-muted/40 md:hidden">
                        <div className="p-4">
                            <NavigationContent />
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;