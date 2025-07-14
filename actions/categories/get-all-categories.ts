"use server";

import prisma from "@/lib/prisma";

export const getAllCategoriesData = async () => {
    try {
        const categoriesData = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                icon: true,
                color: true
            }
        })

        console.log(categoriesData)

        return { categoriesData, };
    } catch (error) {
        console.error("Error fetching categories data:", error);
        return {
            error: "Failed to fetch categories data.",
        };
    }
}