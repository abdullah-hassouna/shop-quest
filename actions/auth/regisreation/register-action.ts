"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signUpValidationSchema } from "@/validation/auth-validation";
import sendNewToken from "../token/create-token";
import createNewToken from "../token/create-token";

export const register = async (values: { fullname: string, email: string, password: string, }) => {
    let validatedFields = values;

    try {
        validatedFields = await signUpValidationSchema.validate(values, { abortEarly: false });
    } catch (error) {
        if (error instanceof Error) {
            return {
                error: error.message,
            };
        }
    }

    const { fullname, email, password } = validatedFields;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await prisma.user.findUnique({
        where: { email: email },
    });

    if (existingUser) {
        return {
            error: "Email already taken!",
        };
    }
    await prisma.user.create({
        data: {
            name: fullname,
            email,
            hashedPassword,
        },
    });

    await createNewToken(email, fullname);

    return {
        success: "User successfully created!",
        redirect: "/auth/check-email",
    };
};