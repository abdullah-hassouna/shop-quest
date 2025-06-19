"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from 'next/headers';
import { logInValidationSchema } from "@/validation/auth-validation";
import sendNewToken from "../token/create-token";
import createNewSession from "../session/create-new-session";

export const login = async (values: { email: string, password: string }) => {
    let validatedFields = values;
    const cookieStore = await cookies();

    try {
        validatedFields = await logInValidationSchema.validate(values, { abortEarly: false });
    } catch (error) {
        if (error instanceof Error) {
            return {
                error: error.message,
            };
        }
    }

    const { email, password } = validatedFields;
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return {
            error: "Invalid email or password.",
        };
    }
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword as string);

    if (!isPasswordValid) {
        return {
            error: "Invalid email or password.",
        };
    }

    if (user.emailVerified === null) {
        await sendNewToken(email, user.name as string);
        return {
            error: "Email not validated. Validation token created.",
            redirect: "/auth/check-email",
        };
    }

    cookieStore.set("token", await createNewSession(user.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 24 * 60 * 60,
        path: "/",
    });

    return {
        success: "Login successful!",
        redirect: "../",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
    };
};