import connectDB from "@/lib/connectDB";
import User from "@/models/UserModel";
import { z } from "zod";
import { userNameValidation } from "@/Schemas/signUpSchema";

// Check if the username is unique
const checkUsernameSchema = z.object({
    userName: userNameValidation
});

export async function GET(req: Request) {

    await connectDB();

    try {

        const url = new URL(req.url);

        const queryParams = {
            userName: url.searchParams.get("userName")
        }

        //Validate the query parameters using Zod
        const validatedParams = checkUsernameSchema.safeParse(queryParams);

        if (!validatedParams.success) {
            const error = z.flattenError(validatedParams.error).fieldErrors.userName;
            return Response.json({ success: false, message: error?.[0] || "Invalid username" }, { status: 400 });
        }

        const { userName } = validatedParams.data;

        // Check if the username already exists in the database
        const existingVerifiedUser = await User.findOne({ userName, isVerified: true });

        if (existingVerifiedUser) {
            return Response.json({ success: false, message: "Username is already taken" }, { status: 409 });
        }

        return Response.json({ success: true, message: "Username Is Unique" }, { status: 200 });

    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json({ success: false, message: "Error checking username uniqueness" }, { status: 500 });
    }
}