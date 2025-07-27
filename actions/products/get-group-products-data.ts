"use server";

import prisma from "@/lib/prisma";
import { GetProductDataResponse } from "@/types/get-data-response";

export const getGroupProductsData = async (take: number): Promise<{ products?: GetProductDataResponse[], error?: string }> => {
    try {
        const products = await prisma.product.findMany({
            include: {
                imagesId: true,
                seller: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                category: true,
                tags: true,
                Review: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        },
                        createdAt: true,
                        updatedAt: true
                    }
                }
            },
            take
        })

        if (!products || products.length === 0) {
            return { error: "No products found." };
        }

        return { products: products as GetProductDataResponse[] };
    } catch (error) {
        console.error("Error fetching group product data:", error);
        return {
            error: "Failed to fetch group product data.",
        };
    }
}