"use server";

import prisma from '@/lib/prisma';
import { ActionReturnType } from '@/types/actions-return-type';
import { GetUserDataResponse } from '@/types/get-data-response';
import bcrypt from 'bcryptjs';
import { cache } from 'react';


export const updateUserData = cache(async (newUserData: { id: string, name: string | null, email: string | null, emailVerified: Date | null, password: string | null, image: string | null, role: "ADMIN" | "BUYER", }): Promise<ActionReturnType<GetUserDataResponse>> => {

    const newUserDataFormed = { ...newUserData, hashedPassword: "" };
    if (newUserData.password) {
        newUserDataFormed.password = null
        const newHashedPass = await bcrypt.hash(newUserData.password, 10)
        newUserDataFormed.hashedPassword = newHashedPass
    }
    try {
        const user = await prisma?.user.update({
            where: {
                id: newUserData.id
            },
            data: {
                ...newUserDataFormed
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                sessions: {
                    select: {
                        expires: true
                    }
                }
            }
        });

        return {
            data: user as GetUserDataResponse | null,
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error updating user",
            success: false
        };
    }
})