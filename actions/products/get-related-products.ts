"use server";

import prisma from "@/lib/prisma";
import { ProductInterface } from "@/types/product-type";

export const getRelatedProducts = async (product: ProductInterface) => {
    try {
        const relatedProducts = await prisma.product.findMany({
            where: {
                id: { not: product?.id },
                tags: {
                    some: {
                        id: { in: product.tags?.map(tag => tag.id) },
                    },
                }
            },
            include: { imagesId: true },
            take: 10, // limit results
        });

        // console.log(relatedProducts)

        return {
            relatedProducts,
        };
    } catch (error) {
        console.error("Error fetching product data:", error);
        return {
            error: "Failed to fetch product data.",
        };
    }
}