import connectDB from "@/lib/connectDB";
import User from "@/models/UserModel";
import { Message } from "@/models/UserModel"
import { messageSchema } from "@/Schemas/messageSchema";
import { z } from "zod";

export async function POST(req: Request) {

    await connectDB();

    try {

        const { userName, messageContent } = await req.json();

        //Validate The Message Content With ZOD
        const validatedMessage = messageSchema.safeParse({ content: messageContent });

        if (!validatedMessage.success) {
            const errorMessages = z.flattenError(validatedMessage.error).fieldErrors.content?.[0];
            return Response.json({ success: false, message: errorMessages });
        }

        // Find the user by username and check if they are accepting messages
        const user = await User.findOne({ userName });

        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (!user.isAcceptingMessages) {
            return Response.json({ success: false, message: "User is not accepting messages Currently" }, { status: 403 });
        }

        // Add the message to the user's messages array

        const message = {
            content: messageContent,
            createdAt: new Date()
        };
        
        user.messages.push(message as Message);
        await user.save();

        return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error sending message:", error);
        return Response.json({ success: false, message: "Error sending message" }, { status: 500 });
    }

}