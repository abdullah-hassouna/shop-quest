'use server';
import prisma from "@/lib/prisma";
import { UserDataInterface } from "@/types/user-data-type";
import { cookies } from 'next/headers';

function isExpired(expiryDate: Date | null): boolean {
    if (expiryDate === null) return false
    const currentDate = new Date();
    return expiryDate < currentDate;
}


export default async function getUserSession(): Promise<{
    success: boolean;
    sessionExpired: boolean;
    userData: UserDataInterface | null;
}> {
    try {

        const userToken = (await cookies()).get('token')?.value;

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
                        rooms: true,
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
            userData: userData.user as UserDataInterface
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
