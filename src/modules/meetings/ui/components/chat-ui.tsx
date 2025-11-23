import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query"

import { useEffect, useState } from "react"
import type { Channel as StreamChannel } from "stream-chat";
import {
    Chat,
    useCreateChatClient,
    Channel,
    MessageInput,
    MessageList,
    Thread,
    Window
} from "stream-chat-react"

import { LoadingStates } from "@/components/loading-states";

import "stream-chat-react/dist/css/v2/index.css";

interface ChatUIProps {
    meetingId: string,
    meetingName: string,
    userId: string,
    userName: string,
    userImage: string | null | undefined,
}

export const ChatUI = ({ meetingId, meetingName, userId, userName, userImage }: ChatUIProps) => {
    const trpc = useTRPC();

    const { mutateAsync: generateChatToken } = useMutation(
        trpc.meetings.generateChatToken.mutationOptions(),
    );

    const [channel, setChannel] = useState<StreamChannel>();
    const client = useCreateChatClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
        tokenOrProvider: generateChatToken,
        userData: {
            id: userId,
            name: userName,
            image: userImage ?? undefined,
        }
    });

    useEffect(() => {
        if (!client) return;

        const newChannel = client.channel("messaging", meetingId, {
            members: [userId],
        });

        setChannel(newChannel);
    }, [client, meetingId, meetingName, userId])

    if (!client) {
        return (
            <LoadingStates
                title="Loading Chat"
                description="This may take a few seconds"
            />
        )
    }

    return (
        <div className="bg-white rounded-lg border overflow-hidden">
            <Chat client={client}>
                <Channel channel={channel}>
                    <Window>
                        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
                            <MessageList />
                        </div>
                        <MessageInput />
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    )
}