"use server";

import prisma from '@/lib/prisma';
import { ActionReturnType } from '@/types/actions-return-type';
import { GetUserDataResponse } from '@/types/get-data-response';
import { cache } from 'react';


export const getAllUsers = cache(async (page: string | number, take: number = 2, search: string = "", orderBy?: { order: string, sort: 'asc' | 'desc', } | null,): Promise<ActionReturnType<GetUserDataResponse[]>> => {
    const index = (Number(page) || 1) - 1;

    try {
        const users = await prisma?.user.findMany({
            orderBy: {
                [orderBy ? orderBy.order : "id"]: orderBy ? orderBy.sort : "asc"
            },
            where: {
                OR: [
                    {
                        name: {
                            contains: search.toLowerCase(),
                        }
                    },
                    {
                        email: {
                            contains: search.toLowerCase(),
                        }
                    },
                    {
                        name: {
                            contains: search.toUpperCase(),
                        }
                    },
                    {
                        email: {
                            contains: search.toUpperCase(),
                        }
                    }
                ]
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
                sessions: {
                    select: {
                        expires: true
                    }
                }
            },
            skip: index * take,
            take: take
        });

        return {
            data: users as GetUserDataResponse[] | null,
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching users",
            success: false
        };
    }
})


export const getAllUsersPages = cache(async (take: number = 2, search: string = ""): Promise<ActionReturnType<number>> => {

    try {
        const usersPagesCount = await prisma?.user.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: search.toLowerCase(),
                        }
                    },
                    {
                        email: {
                            contains: search.toLowerCase(),
                        }
                    },
                    {
                        name: {
                            contains: search.toUpperCase(),
                        }
                    },
                    {
                        email: {
                            contains: search.toUpperCase(),
                        }
                    }
                ]
            },
        });
        return {
            data: usersPagesCount ? Math.ceil(usersPagesCount / take) : 0,
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching users",
            success: false
        };
    }
})