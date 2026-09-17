"use client"
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { ApiResponse } from '@/Types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const SendMessage = () => {

    const { userName } = useParams<{ userName: string }>()

    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([])
    const [isSuggestedMessageRefreshing, setIsSuggestedMessageRefreshing] = useState<boolean>(false)

    const ref = useRef<HTMLTextAreaElement>(null)

    // Function to fetch suggested messages from the API
    const fetchSuggestedMessages = async () => {

        try {

            setIsSuggestedMessageRefreshing(true)

            const response = await axios.get<ApiResponse>(`/api/suggest-messages`)

            const messages = response.data.message.split('||').map((msg: string) => msg.trim())
            setSuggestedMessages(messages)

            toast.add({
                title: 'Suggested Messages Fetched',
                description: 'Successfully fetched suggested messages.',
                type: 'success',
            })


        } catch (error) {

            console.error('Error fetching suggested messages:', error)
            toast.add({
                title: 'Error Fetching Suggested Messages',
                description: 'Failed to fetch suggested messages.',
                type: 'error',
            })

        } finally {
            setIsSuggestedMessageRefreshing(false)
        }

    }

    // Function to set the selected suggested message in the textarea
    const setSelectedMessage = (message: string) => {

        if (ref.current) {
            ref.current.value = message
        }

    }

    // Function to send the message
    const sendMessage = async () => {

        try {

            setIsSuggestedMessageRefreshing(true)

            const messageContent = ref.current?.value

            const response = await axios.post<ApiResponse>(`/api/send-message`, {
                userName,
                messageContent: messageContent
            })


            if (response.data.success) {

                toast.add({
                    title: response.data.message,
                    type: 'success',
                })

            }else {

                toast.add({
                    title: 'Error Sending Message',
                    description: response.data.message,
                    type: 'error',
                })

            }

        } catch (error) {

            const axiosError = error as AxiosError<ApiResponse>
            toast.add({
                title: 'Error Sending Message',
                description: axiosError.response?.data.message,
                type: 'error',
            })

        } finally {
            ref.current!.value = ''
            setIsSuggestedMessageRefreshing(false)
        }

    }

    useEffect(() => {

        fetchSuggestedMessages()

    }, [])



    return (
        <div className="mt-8 md:mt-10 flex flex-col my-6 items-center">

            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">Public Profile Link</h1>

            <div className="flex flex-col p-5 md:p-0 w-full md:w-3/4 mt-2 md:mt-6">

                <p className="font-bold text-md md:text-xl">Send an anonymous message to ~ {userName}</p>

                <textarea
                    ref={ref}
                    placeholder={`Type your message here...`}
                    className="w-full border my-2 shadow-md p-3 rounded text-lg"
                    rows={8}
                />

                <div className="w-full flex items-center justify-center">
                    <Button disabled={isSuggestedMessageRefreshing} onClick={() => sendMessage()} className="p-6 mt-0 sm:mt-2 text-lg cursor-pointer">Send Message</Button>
                </div>

            </div>


            <div className="flex flex-col border-4 p-5 md:p-0 w-full md:w-3/4 mt-2 md:mt-6">

                <div className="w-full p-4">
                    <Button disabled={isSuggestedMessageRefreshing} onClick={() => fetchSuggestedMessages()} className="p-6 mt-0 sm:mt-2 text-lg cursor-pointer">Suggest Messages</Button>
                </div>

                <div className="w-full p-4">

                    <p className="font-bold text-md md:text-xl mt-2">Select Any Suggested Message From Below</p>

                    <div className="mt-2">

                        <div className="flex flex-col gap-4 w-full">
                            {
                                isSuggestedMessageRefreshing ? (
                                    <Loader2 className="mx-auto animate-spin" />
                                ) : (
                                    suggestedMessages.map((message, index) => (
                                        <Button onClick={() => setSelectedMessage(message)} variant={'outline'} key={index} className="w-full p-8 cursor-pointer border">
                                            <p className="text-xl">{message}</p>
                                        </Button>

                                    ))
                                )
                            }
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default SendMessage
