import prisma from "@/lib/prisma";

export async function getLastAnnouncement() {
    try {
        const announcements = await prisma?.anoouncement.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        })
        if (announcements) {
            return announcements;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}