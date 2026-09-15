import User from "@/models/UserModel";
import bcrypt from "bcrypt";
import connectDB from "@/lib/connectDB";
import { signInSchema } from "@/Schemas/signInSchema";
import { z } from "zod";

export async function POST(req: Request) {

    await connectDB();

    try {

        const { identifier, password } = await req.json();

        //Validate Input Using Zod Schema
        const credential = {
            identifier,
            password
        }

        const validatedBody = signInSchema.safeParse(credential);

        if (!validatedBody.success) {
            const identifierErrors = z.flattenError(validatedBody.error).fieldErrors.identifier;
            const passwordErrors = z.flattenError(validatedBody.error).fieldErrors.password;
            return Response.json({ success: false, message: identifierErrors?.[0] || passwordErrors?.[0] }, { status: 400 });
        }

        //Check If Provided Credentials are valid
        const checkUser = await User.findOne({
            $or: [
                { userName: identifier },
                { email: identifier }
            ]
        });

        //User Does Not Exist
        if (!checkUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        //User Exists but not verified
        if (!checkUser.isVerified) {
            return Response.json({ success: false, message: "Please verify your email before logging in." }, { status: 403 });
        }

        //Check If Password is Valid
        const isPasswordValid = await bcrypt.compare(password, checkUser.password);

        //Password is Invalid
        if (!isPasswordValid) {
            return Response.json({ success: false, message: "Invalid password" }, { status: 401 });
        }

        //Password is Valid & User is Verified
        return Response.json({ success: true, message: "Sign-In successful" }, { status: 201 });

    } catch (error) {

        console.error("Error during sign-in:", error);
        return Response.json({ success: false, message: "Error during sign-in" }, { status: 500 });

    }

}