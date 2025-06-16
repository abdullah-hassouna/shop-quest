"use server"
import prisma from "@/lib/prisma";


async function checkToken(email: string, token: string): Promise<boolean> {
    const tokenRecord = await prisma.verificationToken.delete({
        where: {
            identifier: email,
            token: token,
        }
    })

    console.log(email, token)
    if (tokenRecord) {
        if (tokenRecord.expires < new Date()) {
            console.log("Token has expired");
            return false;
        } else {
            console.log("Token is valid");
            await prisma.user.update({
                where: { email: email },
                data: { emailVerified: new Date() },
            });
            return true;
        }
    }

    return tokenRecord ? true : false
}

export default checkToken