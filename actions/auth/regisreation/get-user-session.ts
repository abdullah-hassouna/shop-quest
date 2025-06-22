'use server';

import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';

function isExpired(expiryDate: Date | null): boolean {
    if (expiryDate === null) return false
    const currentDate = new Date();
    return expiryDate < currentDate;
}

export default async function getUserSession() {
    try {

        const userToken = (await cookies()).get('token')?.value;

        console.log("userToken:", userToken)

        if (!userToken) return {
            success: true,
            sessionExpired: true,
            userData: null
        };

        const userData = await prisma?.session.findFirst({
            where: {
                sessionToken: userToken
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        })

        if (!userData || isExpired(userData!.expires)) {
            return {
                success: true,
                sessionExpired: true,
                userData: null
            }
        }

        return {
            success: true,
            sessionExpired: false,
            userData: userData.user
        }
    } catch (error) {
        console.error("Error fetching user session:", error);
        return {
            success: false,
            sessionExpired: false,
            userData: null
        }
    }
}
