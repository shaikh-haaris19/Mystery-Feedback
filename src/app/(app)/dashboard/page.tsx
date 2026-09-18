"use client"

import { Message } from "@/models/UserModel"
import { acceptingMessageSchema } from "@/Schemas/acceptingMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { ApiResponse } from "@/Types/ApiResponse"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"

const Dashboard = () => {

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

    const handleDeleteMessage = (messageId: string) => {

        setMessages(messages.filter((message) => message._id.toString() !== messageId));

    }

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptingMessageSchema),
        defaultValues: {
            isAcceptingMessages: false
        }
    })

    const { register, watch, setValue } = form;

    const isAcceptingMessages = watch("isAcceptingMessages");

    // Fetch the isAcceptingMessages status from the server and update the form state
    const fetchAcceptingMessagesStatus = useCallback(async () => {

        setLoading(true);

        try {

            const response = await axios.get(`/api/accept-messages`)
            setValue("isAcceptingMessages", response.data.isAcceptingMessages)

        } catch (error) {

            const errorMessage = error as AxiosError<ApiResponse>;
            toast.add({
                title: "Error",
                description: errorMessage.response?.data.message,
                type: "error"
            })


        } finally {

            setLoading(false);

        }

    }, [setValue])

    // Fetch all messages from the server and update the Messages state
    const fetchAllMessages = useCallback(async () => {

        setLoading(true);
        setIsSwitchLoading(false);

        try {

            const response = await axios.get<ApiResponse>(`/api/get-messages`)

            setMessages(response.data.messages || [])

        } catch (error) {

            const errorMessage = error as AxiosError<ApiResponse>;
            toast.add({
                title: "Error",
                description: errorMessage.response?.data.message,
                type: "error"
            })

        } finally {

            setLoading(false);
            setIsSwitchLoading(true);

        }

    }, [setLoading])

    // Fetch messages and the isAcceptingMessages status when the component mounts or when the session changes
    useEffect(() => {

        if (!session || !session.user) {
            return;
        }

        fetchAllMessages();
        fetchAcceptingMessagesStatus();

    }, [session, setValue, fetchAcceptingMessagesStatus])

    //Handle the switch toggle for accepting messages
    const handleSwitchToggle = async () => {

        setIsSwitchLoading(true);

        try {

            const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
                isAcceptingMessages
            })

            setValue("isAcceptingMessages", !isAcceptingMessages)

            toast.add({
                title: "Success",
                description: response.data.message,
                type: "success"
            })

        } catch (error) {

            const errorMessage = error as AxiosError<ApiResponse>;

            toast.add({
                title: "Error",
                description: errorMessage.message,
                type: "error"
            })

        } finally {

            setIsSwitchLoading(false);

        }

    }

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
                <p className="text-gray-600">Please log in to access the dashboard.</p>
            </div>
        )
    }

    const { userName } = session.user;
    const baseUrl = `${window.location.origin}`;

    const Url = `${baseUrl}/user/${userName}`;

    const copyToClipboard = () => {

        const textToCopy = Url;

        navigator.clipboard.writeText(textToCopy)

        toast.add({
            title: "Copied to clipboard",
            description: "The URL has been copied to your clipboard.",
            type: "success"
        })

    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">

            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">

                <h2 className="text-lg font-semibold mb-2">Copy Your Unique URL</h2>
                <div className="flex items-center">

                    <input
                        type="text"
                        value={Url}
                        readOnly
                        className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />

                    <Button onClick={copyToClipboard} className="p-6 ml-2 cursor-pointer" >
                        Copy
                    </Button>

                </div>
            </div>

            <div>
                <Switch
                    {...register("isAcceptingMessages", { required: true })}
                    checked={isAcceptingMessages}
                    onCheckedChange={handleSwitchToggle}
                    className="cursor-pointer"
                    disabled={loading}
                />
                <span className="ml-2">
                    Accept Messages: {isAcceptingMessages ? "Yes" : "No"}
                </span>
            </div>

            <Separator />

            <Button
                onClick={() => fetchAllMessages()}
                className="mt-4 cursor-pointer"
                disabled={loading}
                variant="outline"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            </Button>

            <div className="mt-8 md:mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {
                    messages.length > 0 ? (
                        messages.map((message, index) => (
                            <MessageCard key={index} message={message} onMessageDelete={handleDeleteMessage} />
                        ))
                    ) : (
                        <p className="text-gray-500">No messages to display.</p>
                    )
                }
            </div>

        </div>
    )
}

export default Dashboard
