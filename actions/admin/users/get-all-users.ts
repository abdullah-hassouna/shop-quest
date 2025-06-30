"use server";

import prisma from '@/lib/prisma';
import { ActionReturnType } from '@/types/actions-return-type';
import { GetAllUsersResponse } from '@/types/get-all-users-response';
import { cache } from 'react';


export const getAllUsers = cache(async (page: string | number, take: number = 2, search: string = "", orderBy: { order: string, sort: 'asc' | 'desc', } = { sort: "asc", order: "createdAt" },): Promise<ActionReturnType<GetAllUsersResponse[]>> => {
    const index = (Number(page) || 1) - 1;

    try {
        const users = await prisma?.user.findMany({
            orderBy: {
                [orderBy.order]: orderBy.sort
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
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            skip: index * take,
            take: take
        });

        console.log("Fetched users:", users);
        console.log("Page:", page, "Take:", take, "Order By:", orderBy, "Search:", search);

        return {
            data: users as GetAllUsersResponse[] | null,
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