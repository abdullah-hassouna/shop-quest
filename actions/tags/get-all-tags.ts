"use server";

import prisma from "@/lib/prisma";

export const getAllTagsData = async () => {
    try {
        const tagsData = await prisma.tag.findMany({
            select: {
                id: true,
                name: true,
            }
        })

        console.log(tagsData)

        return { tagsData, };
    } catch (error) {
        console.error("Error fetching tags data:", error);
        return {
            error: "Failed to fetch tags data.",
        };
    }
}