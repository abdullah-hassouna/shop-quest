import prisma from "@/lib/prisma";
import { randomBytes } from 'crypto';
import sendNewToken from "./email-verfiy/send-token";


async function createNewToken(email: string, fullname: string): Promise<void> {
    const validationToken = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token: validationToken,
            expires: new Date(Date.now() + 1000 * 60 * 60),
        },
    });

    const verifyLink = `${process.env.VERFIY_LINK}?token=${validationToken}&email=${email}`;

    console.log(verifyLink)

    await sendNewToken({
        userName: fullname,
        userEmail: email,
        verifyLink,
    });
}

export default createNewToken