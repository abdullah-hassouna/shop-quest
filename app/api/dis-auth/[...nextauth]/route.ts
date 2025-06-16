import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                fullname: { label: "FullName", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    const hashedPassword = await bcrypt.hash(credentials.password, 12);
                    const newUser = await prisma.user.create({
                        data: {
                            name: credentials.fullname,
                            email: credentials.email,
                            hashedPassword: hashedPassword,
                        }
                    });
                    return newUser;
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword as string
                );

                if (!isPasswordCorrect) {
                    throw new Error("Invalid password");
                }

                return user;
            }
        })
    ],
    pages: {
        signIn: "/auth/signIn",
        signUp: "/auth/signUp",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };