import { resend } from '../lib/resend';
import { ResendVerificationEmail } from "../../Email/VerificationEmail";
import { ApiResponse } from "../Types/ApiResponse";

const sendVerificationEmail = async (userName: string, email: string, verificationCode: string): Promise<ApiResponse> => {

    try {

        // Send the verification email using Resend
        const emailRes = await resend.emails.send({
            from: 'onboarding@resend.dev', // Add your verified sender email here
            to: email,
            subject: 'Mystery Feedback - Verification Code',
            react: ResendVerificationEmail({ username: userName, otp: verificationCode }),
        });

        if(emailRes.error){

            console.error('Error sending verification email:', emailRes.error);
            return {
                success: false,
                message: 'Failed to send verification email. Please try again later.',
            };

        }

        return {
            success: true,
            message: 'Verification email sent successfully',
        };

    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            success: false,
            message: 'Failed to send verification email. Please try again later.',
        };
    }

};

export default sendVerificationEmail;