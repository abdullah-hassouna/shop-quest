"use server"

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { editUserData } from "./edit-user-data";

export interface UserNewDataProps {
    fullname?: string;
    email?: string;
    password?: string;
}

export async function confirmUaserDataUpdate(userId: string, password: string, userNewData: UserNewDataProps): Promise<{
    success: boolean;
    error: string;
    newData?: UserNewDataProps;
    redirect?: string;
}> {
    try {
        if (password && userId) {
            const confingUser = await prisma.user.findFirst({
                where: { id: userId },
            })
            const isPasswordValid = await bcrypt.compare(password, confingUser!.hashedPassword || "");
            if (isPasswordValid) {
                const editData = await editUserData(userId, userNewData)

                console.log(editData)
                return editData
            }

            return {
                success: true,
                error: "Password didn't confimered",
            }
        }

        return {
            success: true,
            error: "Error in Password or USer Session",
        }
    } catch (err: any) {
        return {
            success: false,
            error: err.message,
        }
    }
}