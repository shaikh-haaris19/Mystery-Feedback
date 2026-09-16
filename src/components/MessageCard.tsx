"use client"

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/models/UserModel"
import { ApiResponse } from "@/Types/ApiResponse"
import axios from "axios"
import { toast } from "./ui/toast"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {


    const handleDelete = async () => {

        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)

        if (response.data.success) {

            toast.add({
                title: "Message Deleted Successfully",
                description: response.data.message,
                type: "success"
            })

            onMessageDelete(message._id.toString())

        }

    }


    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger render={<Button variant="destructive"><X className="h-5 w-5" /></Button>} />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you Sure About Deleting the Message?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete()}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>
                    {message.createdAt.toLocaleString()}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}

export default MessageCard
