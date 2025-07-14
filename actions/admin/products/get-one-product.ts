"use server";

import prisma from '@/lib/prisma';
import { ActionReturnType } from '@/types/actions-return-type';
import { GetOneProductDataAdminResponse, GetProductDataResponse } from '@/types/get-data-response';
import { cache } from 'react';

interface ResponseType {
    data: GetOneProductDataAdminResponse | null;
    error: string | null;
    success: boolean;
}


export const getOneProductDataAction = cache(async (productId: string): Promise<ResponseType> => {

    try {
        const products = await prisma?.product.findFirst({
            where: {
                id: productId
            },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                imagesId: {
                    select: {
                        id: true,
                        url: true,
                        alt: true,
                    }
                },
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
                    },
                },
                createdAt: true,
                seller: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        console.log(products)

        return {
            data: products as GetOneProductDataAdminResponse,
            error: null,
            success: true
        };
    } catch (error) {
        return {
            data: null,
            error: "Error fetching products",
            success: false
        };
    }
})