import connectDB from "@/lib/connectDB";
import UserModel from "@/models/UserModel";
import { z } from "zod";
import { verifySchema } from "@/Schemas/verifySchema";

export async function POST(req: Request) {

    await connectDB();

    try {

        const { otp } = await req.json();

        // Extracting UserName From Url 
        const url = new URL(req.url);
        const userName = url.searchParams.get("username");

        // Validate the request body using Zod
        const verifyCode = {
            code: otp
        };

        // Validate the request body using Zod
        const validatedBody = verifySchema.safeParse(verifyCode);

        if (!validatedBody.success) {
            const error = z.flattenError(validatedBody.error).fieldErrors.code;
            return Response.json({ success: false, message: error?.[0] }, { status: 400 });
        }

        // When Correct OTP is provided, check for the user in the database with the given username and isVerified: false
        const User = await UserModel.findOne({ userName, isVerified: false });

        if (!User) {
            return Response.json({ success: false, message: "Cannot find user" }, { status: 400 });
        }

        // Update the user's isVerified status to true
        const isCodeValid = User.verifyCode === otp;
        const isCodeNotExpired = new Date(User.verifyCodeExpiry) > new Date();

        if (!isCodeValid) {
            return Response.json({ success: false, message: "Invalid verification code" }, { status: 400 });
        }

        if (!isCodeNotExpired) {
            return Response.json({ success: false, message: "Expired verification code" }, { status: 400 });
        }

        // If the code is valid and not expired, update the user's isVerified status to true
        User.isVerified = true;
        await User.save();

        return Response.json({ success: true, message: "User verified successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json({ success: false, message: "Error verifying user" }, { status: 500 });
    }

}