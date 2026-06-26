import client from "../config/brevo.js";
import verifyEmailTemplate from "../templates/verifyEmail.js";

export const sendVerificationEmail = async (name, email, token) => {
    const verificationUrl = `${process.env.VERIFICATION_URL}/${token}`;
    await client.transactionalEmails.sendTransacEmail({
        sender: {
            name: process.env.BREVO_SENDER_NAME,
            email: process.env.BREVO_SENDER_EMAIL,
        },
        to:[{email,name}],
        subject:"Verify Your Email",
        htmlContent:verifyEmailTemplate(name,verificationUrl),
    })
}