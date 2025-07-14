"use server";

import prisma from '@/lib/prisma';
import { GetOneUserDataAdminResponse } from '@/types/get-data-response';
import { cache } from 'react';


export const getUserData = cache(async (userId: string): Promise<{ success: boolean, error: string | null, data: GetOneUserDataAdminResponse | null }> => {
    try {
        const user = await prisma?.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                Order: {
                    select: {
                        createdAt: true,
                        total: true,
                        items: {
                            select: {
                                quantity: true,
                                product: {
                                    select: {
                                        id: true,
                                        imagesId: true,
                                        name: true,
                                        price: true,
                                        category: {
                                            select: {
                                                id: true,
                                                name: true,
                                                color: true,
                                                icon: true,
                                            }
                                        },
                                        tags: {
                                            select: {
                                                id: true,
                                                name: true
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    }
                },
                sessions: {
                    select: {
                        expires: true
                    }
                }
            }
        });


        return {
            data: user as unknown as GetOneUserDataAdminResponse,
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching user",
            success: false
        };
    }
})

