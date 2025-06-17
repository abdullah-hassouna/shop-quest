import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

async function createNewSession(userId: string): Promise<string> {
    try {

        const sessionToken = randomBytes(32).toString("hex");

        await prisma?.session.delete({
            where: {
                userId
            }
        }).catch(() => { });

        await prisma.session.create({
            data: {
                sessionToken,
                userId: userId,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
        });
        return sessionToken
    } catch (error) {
        return "";
    }

}

export default createNewSession;