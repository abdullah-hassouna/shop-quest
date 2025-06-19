"use server"

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserNewDataProps } from "./confirm-user-data-update";
import logout from "../auth/regisreation/logout-action";

export async function editUserData(userId: string, userNewData: UserNewDataProps): Promise<{
    success: boolean;
    error: string;
    newData?: UserNewDataProps;
    redrict?: string
}> {
    try {
        if ((userNewData?.email || userNewData?.password || userNewData?.fullname) && userId) {
            const formatedNewData = {} as {
                name?: string;
                email?: string;
                hashedPassword?: string;
                emailVerified?: null
            };

            if (userNewData.email) {
                formatedNewData.email = userNewData.email
                formatedNewData.emailVerified = null
            }
            if (userNewData.fullname) formatedNewData.name = userNewData.fullname
            if (userNewData.password) formatedNewData.hashedPassword = await bcrypt.hash(userNewData.password, 10)

            return await prisma.user.update({
                where: { id: userId },
                data: formatedNewData
            }).then(async () => {
                const { redirect } = await logout();
                return {
                    success: true,
                    error: "",
                    newData: userNewData,
                    redirect
                };
            })
        }

        return {
            success: true,
            error: "Data didn't change",
        }
    } catch (err: any) {
        return {
            success: false,
            error: err.message,
        }
    }
}