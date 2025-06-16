import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

async function createNewSession(userId: string): Promise<string> {
    const sessionToken = randomBytes(32).toString("hex");
    await prisma.session.create({
        data: {
            sessionToken,
            userId: userId,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
    });

    return sessionToken
}

export default createNewSession;