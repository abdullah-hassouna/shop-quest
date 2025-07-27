'use client'

import LogInForm from "@/components/forms/login-form";
import SignUpForm from "@/components/forms/signup-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = React.useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const newAccount = searchParams!.get("new-account");

    useEffect(() => {
        if (newAccount === "1") {
            setIsSignUp(true);
        }
    }, [newAccount]);

    const toggleForm = () => {
        const params = new URLSearchParams(searchParams!.toString())
        if (isSignUp) {
            setIsSignUp(_ => false);
            params.delete("new-account");
        } else {
            setIsSignUp(_ => true);
            params.set("new-account", "1");
        }
    }
    return (
        <div className="flex min-h-[100vh]">
            <Toaster />
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <Link href='/' className='flex justify-center'>
                        <img className='h-56 w-56 rounded-full' src={"shopquest-high-resolution-logo.png"} />
                    </Link>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Sign In</TabsTrigger>
                            <TabsTrigger value="register">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className="space-y-6">
                            <LogInForm routerHook={router} toggleForm={toggleForm} />
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-12 bg-transparent">
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </Button>
                                <Button variant="outline" className="h-12 bg-transparent">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="register" className="space-y-6">
                            <SignUpForm routerHook={router} toggleForm={toggleForm} />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-12 bg-transparent">
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </Button>
                                <Button variant="outline" className="h-12 bg-transparent">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="hidden lg:flex lg:flex-1 bg-primary items-center justify-center p-8">
                <div className="max-w-md text-center text-white">
                    <div className="mb-8">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="h-12 w-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Start Your Shopping Journey</h2>
                        <p className="text-red-100 text-lg leading-relaxed">
                            Discover amazing products across all categories. From electronics to fashion, we have everything you
                            need at unbeatable prices.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center text-red-100">
                            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                            <span>Free shipping on orders over $50</span>
                        </div>
                        <div className="flex items-center text-red-100">
                            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                            <span>30-day money-back guarantee</span>
                        </div>
                        <div className="flex items-center text-red-100">
                            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                            <span>24/7 customer support</span>
                        </div>
                        <div className="flex items-center text-red-100">
                            <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                            <span>Secure payment processing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}