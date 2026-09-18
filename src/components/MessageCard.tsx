"use client"

import {
    Card,
    CardDescription,
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
import { useState } from "react"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const [open, setOpen] = useState(false)

    const handleDelete = async () => {

        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)

        if (response.data.success) {

            toast.add({
                title: "Message Deleted Successfully",
                description: response.data.message,
                type: "success"
            })

            setOpen(false)
            onMessageDelete(message._id.toString())

        }

    }

    return (
        <Card className="w-full max-w-sm shadow-md">
            <CardHeader>
                <CardTitle>{message.content}</CardTitle>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger render={<Button className="cursor-pointer" variant="destructive"><X className="h-5 w-5" /></Button>} />
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
                    {
                        new Date(message.createdAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                        })}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}

export default MessageCard
