"use server";

import prisma from "@/lib/prisma";
import { GetCategoryDataResponse } from "@/types/get-data-response";

export const getAllCategoriesData = async (take: number): Promise<{ categoriesData?: GetCategoryDataResponse[], error?: string }> => {
    try {
        const categoriesData = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                icon: true,
                color: true,
                slug: true
            },
            take
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