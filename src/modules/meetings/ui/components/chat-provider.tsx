"use client";

import { LoadingStates } from "@/components/loading-states";
import { authClient } from "@/lib/auth-client";
import { ChatUI } from "./chat-ui";

interface Props {
    meetingId: string,
    meetingName: string,
}

export const ChatProvider = ({ meetingId, meetingName }: Props) => {
    const { data, isPending } = authClient.useSession();

    if (!data || isPending) {
        return (
            <LoadingStates
                title="Loading chat..."
                description="Please wait while we load the chat"
            />
        )
    }

    return (
        <ChatUI
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            userName={data.user.name}
            userImage={data.user.image ?? ""}
        />
    )
}
