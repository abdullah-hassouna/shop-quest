'use server'

import { cookies } from 'next/headers';


export async function storeRefreshToken(token: string) {
    const cookieStore = await cookies();

    return cookieStore.set("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
    })
}
