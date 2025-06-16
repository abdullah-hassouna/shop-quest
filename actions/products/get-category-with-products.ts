"use server";

import prisma from "@/lib/prisma";

export const getCatalogryWithProducts = async () => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: {
                    take: 4,
                    // select: {
                    //     category: false,
                    //     categoryId: false,
                    //     seller: false,
                    //     sellerId: false,
                    // },
                    include: {
                        imagesId: true,
                        tags: true
                    },
                }
            }
        })

        console.log(categories)

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