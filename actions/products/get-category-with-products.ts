"use server";

import prisma from "@/lib/prisma";

export const getCatalogryWithProducts = async () => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: {
                    take: 8,
                    include: {
                        imagesId: true,
                        tags: true
                    },
                }
            }
        })

        return {
            categories,
        };
    } catch (error) {
        console.error("Error fetching categories with products:", error);
        return {
            error: "Failed to fetch categories with products.",
        };
    }
}