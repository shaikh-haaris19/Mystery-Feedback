import connectDB from "@/lib/connectDB";
import User from "@/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

// Update isAcceptingMessages status
export async function POST(req: Request) {

    await connectDB();

    try {

        const { isAcceptingMessages } = await req.json();

        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.user._id);

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        user.isAcceptingMessages = !isAcceptingMessages;
        await user.save();

        return Response.json({ success: true, message: "User's message acceptance status updated successfully" }, { status: 200 });

    } catch (error) {

        console.error("Error updating user's message acceptance status:", error);
        return Response.json({ success: false, message: "Error updating user's message acceptance status" }, { status: 500 });

    }

}

// Fetch the isAcceptingMessages status
export async function GET(req: Request) {

    await connectDB();

    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.user._id);

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return Response.json({ success: true, isAcceptingMessages: user.isAcceptingMessages }, { status: 200 });

    } catch (error) {

        console.error("Error fetching user's message acceptance status:", error);
        return Response.json({ success: false, message: "Error fetching user's message acceptance status" }, { status: 500 });

    }

}