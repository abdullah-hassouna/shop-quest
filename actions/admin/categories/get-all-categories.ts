"use server";

import prisma from '@/lib/prisma';
import { ActionReturnType } from '@/types/actions-return-type';
import { GetCategoryDataAdminResponse } from '@/types/get-data-response';
import { cache } from 'react';


export const getAllCategories = cache(async (page: string | number, take: number = 2, search: string = "", orderBy?: { order: string, sort: 'asc' | 'desc', } | null,): Promise<ActionReturnType<GetCategoryDataAdminResponse[]>> => {
    const index = (Number(page) || 1) - 1;

    try {
        const categories = await prisma?.category.findMany({
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
                        name: {
                            contains: search.toUpperCase(),
                        }
                    },
                ]
            },
            select: {
                id: true,
                name: true,
                icon: true,
                slug: true,
                color: true,
                createdAt: true,
            },
            skip: index * take,
            take: take
        });

        return {
            data: categories as GetCategoryDataAdminResponse[],
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching categories",
            success: false
        };
    }
})


export const getAllCategoriesPages = cache(async (take: number = 2, search: string = ""): Promise<ActionReturnType<number>> => {

    try {
        const ordersPagesCount = await prisma?.category.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: search.toLowerCase(),
                        }
                    },
                    {
                        name: {
                            contains: search.toUpperCase(),
                        }
                    },
                ]
            },
        });
        return {
            data: ordersPagesCount ? Math.ceil(ordersPagesCount / take) : 0,
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching pages count",
            success: false
        };
    }
})