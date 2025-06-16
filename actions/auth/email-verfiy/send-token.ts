"use server";
import nodemailer from 'nodemailer';

async function sendNewToken(emailData: {
    userName: string,
    userEmail: string,
    verifyLink: string,
    from_name?: "ShopQuest"
}) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "abood2119hass@gmail.com",
            pass: "fbjbrfaojtvbrovv",
        },
    });

    (async () => {
            await transporter.sendMail({
                from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
                to: emailData.userEmail, // list of receivers
                subject: "Verfy your email - ShopQuest",
                html: `
                <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Verify Your Email</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f7; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 40px;">
              <tr>
                <td style="text-align: center; padding-bottom: 30px;">
                  <h1 style="margin: 0; font-size: 24px; color: #333333;">Verify Your Email Address</h1>
                </td>
              </tr>
              <tr>
                <td style="font-size: 16px; color: #555555; line-height: 1.5;">
                  <p>Hi <strong>${emailData.userName}</strong>,</p>
                  <p>Thank you for signing up at <strong>ShopQuest</strong>! To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="${emailData.verifyLink}" target="_blank" style="background-color: #1a73e8; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">Verify My Email</a>
                  </p>
                  <p>This step helps us confirm that this is the correct email address you used to register and ensures you receive important updates from us.</p>
                  <p>If you did not sign up for an account at <strong>ShopQuest</strong>, please ignore this email.</p>
                  <hr style="border: none; border-top: 1px solid #dddddd; margin: 30px 0;" />
                  <p><strong>Why verify your email?</strong></p>
                  <ul style="color: #555555; padding-left: 20px; margin: 0 0 20px 0;">
                    <li>Confirm ownership of the email address</li>
                    <li>Access all features of your account</li>
                    <li>Receive important notifications and updates</li>
                  </ul>
                  <p>If the button above does not work, please copy and paste the following URL into your browser:</p>
                  <p style="word-break: break-all; color: #1a73e8;"><a href="${emailData.verifyLink}" target="_blank" style="color: #1a73e8; text-decoration: underline;">Verification Link</a></p>
                  <p>Thank you,<br /><strong>The ShopQuest Team</strong></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
            });
    
    })();
}

export default sendNewToken;
