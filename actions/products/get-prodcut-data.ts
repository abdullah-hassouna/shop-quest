"use server";

import prisma from "@/lib/prisma";

export const getProductData = async (id: string) => {
    try {
        const productData = await prisma.product.findFirst({
            where: { id }
            , include: {
                imagesId: true,
            },
        })

        console.log("Product Data: ", productData)

        return { productData, };
    } catch (error) {
        console.error("Error fetching product data:", error);
        return {
            error: "Failed to fetch product data.",
        };
    }
}