import React from "react";
import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
                <MailCheck className="h-16 w-16 text-purple-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2 text-gray-800">Check your email</h1>
                <p className="text-gray-600 text-center mb-4">
                    We’ve sent a verification link to your email address. Please check your inbox and follow the instructions to verify your account.
                </p>
                <p className="text-gray-400 text-sm text-center">
                    Didn’t receive the email? Please check your spam folder or try again.
                </p>
            </div>
        </div>
    );
}