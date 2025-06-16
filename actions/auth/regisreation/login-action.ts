"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logInValidationSchema } from "@/validation/auth-validation";
import { storeRefreshToken } from "../store-token/store-refresh-token";
import sendNewToken from "../create-token";
import createNewSession from "../create-new-session";

export const login = async (values: { email: string, password: string }) => {
    let validatedFields = values;

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
    storeRefreshToken(await createNewSession(user.id));

    return {
        success: "Login successful!",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};