"use server"

import { cookies } from "next/headers";

export default async function logout(): Promise<{ success: boolean, redirect: string }> {
    try {
        const userToken = (await cookies()).get('token')?.value;

        if (!userToken) return {
            success: true,
            redirect: ""
        };

        const userDeletedSession = await prisma?.session.delete({
            where: {
                sessionToken: userToken
            }
        })

        if (userDeletedSession) return {
            success: true,
            redirect: "/auth"
        };

        return {
            success: false,
            redirect: ""
        };
    } catch (error) {
        return {
            success: false,
            redirect: ""
        };
    }
} 