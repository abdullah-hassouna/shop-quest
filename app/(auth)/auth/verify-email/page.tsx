"use client"

import React, { useEffect, useState } from "react";
import checkToken from "@/actions/auth/email-verfiy/check-token";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const [verfiyDone, setVerfiyDone] = useState<boolean>(false);
    const { push } = useRouter();

    useEffect(() => {
        const verify = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get("token");
            const email = searchParams.get("email");
            const success = await checkToken(email as string, token as string);
            setVerfiyDone(success);
        };
        verify();
    }, [])

    useEffect(() => {
        if (verfiyDone) {
            push("/auth");
        }
    }, [verfiyDone]);

    return (
        <div>
            <h1>verifying your email your email</h1>
        </div>
    );
}