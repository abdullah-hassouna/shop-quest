"use server";
import prisma from "@/lib/prisma";
import { storeRefreshToken } from "../token/store-refresh-token";
import { randomBytes } from "crypto";

export const verifyLogin = async (token: string) => {
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
        return {
            error: "Invalid or expired verification token.",
        };
    }

    const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier },
    });

    if (!user) {
        return {
            error: "User not found.",
        };
    }

    await prisma.user.update({
        where: { email: user.email as string },
        data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
        where: { token },
    });

    const sessionToken = randomBytes(32).toString("hex");
    await prisma.session.create({
        data: {
            sessionToken,
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
    });

    storeRefreshToken(sessionToken);

    return {
        success: "Email verified and login successful!",
        redirect: "/",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};