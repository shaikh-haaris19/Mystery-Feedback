import connectDB from "@/lib/connectDB";
import User from "@/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(req: Request) {

    await connectDB();

    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = new mongoose.Types.ObjectId(session.user._id);

        // Use aggregation to fetch messages sorted by createdAt in descending order
        const user = await User.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ]);

        if (!user || user.length === 0) {
            return Response.json({ success: false, message: "User not found Or No messages found" }, { status: 404 });
        }

        return Response.json({ success: true, messages: user[0].messages });

    } catch (error) {
        console.error("Error fetching user's messages:", error);
        return Response.json({ success: false, message: "Error fetching user's messages" }, { status: 500 });
    }
}