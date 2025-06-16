'use client'

import LogInForm from "@/app/forms/login-form";
import SignUpForm from "@/app/forms/signup-form";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = React.useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const newAccount = searchParams.get("new-account");

    useEffect(() => {
        if (newAccount === "1") {
            setIsSignUp(true);
        }
    }, [newAccount]);

    const toggleForm = () => {
        const params = new URLSearchParams(searchParams.toString())
        if (isSignUp) {
            setIsSignUp(_ => false);
            params.delete("new-account");
        } else {
            setIsSignUp(_ => true);
            params.set("new-account", "1");
        }
    }
    return (
        <div className="flex min-h-screen mt-7 ">
            <div className="w-full max-w-3xl mx-auto flex flex-col p-3">
                <div className="mb-8 lg:mb-12 cursor-pointer" onClick={() => router.push("/")}>
                    <ChevronLeft className="text-gray-500 h-6 w-6 sm:h-8 sm:w-8 border-2 rounded-full p-1" />
                </div>
                <div>
                    <h2 className='text-3xl mt-10 sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent pb-3 capitalize'>
                        {isSignUp ? 'create new account' : 'welcome back'}
                    </h2>
                    <p className='text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8'>
                        {isSignUp
                            ? 'Join ShopQuest today and discover exclusive deals on your favorite products!'
                            : 'Welcome back to ShopQuest! Log in to continue your shopping journey.'}
                    </p>
                </div>

                {isSignUp ? <SignUpForm routerHook={router} isSignUp={isSignUp} toggleForm={toggleForm} />
                    : <LogInForm routerHook={router} isSignUp={isSignUp} toggleForm={toggleForm} />}
            </div>
        </div>
    )
}