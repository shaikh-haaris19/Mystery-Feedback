import connectDB from "@/lib/connectDB";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import User from "@/models/UserModel";

export async function DELETE(req: Request, { params }: { params: { messageId: string } }) {

    const { messageId } = await params;

    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return Response.json({ success: false, message: "Unauthorized" }, {
            status: 401
        });
    }

    try {

        const updatedResult = await User.updateOne(
            { _id: session.user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updatedResult?.modifiedCount === 0) {
            return Response.json({ success: false, message: "Message not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Message deleted successfully" });

    } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json({ success: false, message: "Error deleting message" }, { status: 500 });
    }

}