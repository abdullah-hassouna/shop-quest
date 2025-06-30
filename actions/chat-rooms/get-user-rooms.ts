"use server";

import prisma from "@/lib/prisma";
import type { Room } from "@prisma/client"
import getUserSession from "../auth/regisreation/get-user-session";

export interface ChatRoomInterface extends Room {
    users: { id: string, name: string, image: string }[] | null
}

export async function getUserRooms(): Promise<{
    success: boolean,
    error: string | null,
    userRooms: ChatRoomInterface[] | any[]
}> {
    try {
        const { success, sessionExpired, userData } = await getUserSession()

        if (success && !sessionExpired && userData) {
            const userRooms = await prisma?.room.findMany({
                include: {
                    users: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                },
                where: {
                    users: {
                        some: {
                            id: userData.id
                        }
                    }
                }
            })

            if (userRooms.length) {
                let allUserRooms = userRooms as ChatRoomInterface[];
                // if (userData.role === 'ADMIN') {
                allUserRooms.concat([{ id: "general-admin-chat", users: [] } as unknown as ChatRoomInterface]);
                // }
                return {
                    success: true,
                    error: null,
                    userRooms: allUserRooms
                }
            }

            return {
                success: true,
                error: null,
                userRooms: []
            }
        } else {
            return {
                success: false,
                error: "Somthing went wrong, please try again later.",
                userRooms: []
            }
        }

    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            userRooms: []
        }
    }
}

