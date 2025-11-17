"use client";

import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";

import {
    Call,
    CallingState,
    StreamCall,
    StreamVideo,
    StreamVideoClient
} from "@stream-io/video-react-sdk";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

import "@stream-io/video-react-sdk/dist/css/styles.css"
import { CallUI } from "./call-ui";

interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string | undefined;
}

export const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }: Props) => {
    const trpc = useTRPC();

    const { mutateAsync: generateToken } = useMutation(
        trpc.meetings.generateToken.mutationOptions(),
    )

    const [client, setClient] = useState<StreamVideoClient>();
    useEffect(() => {
        const initClient = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
            user: {
                id: userId,
                name: userName,
                image: userImage
            },
            tokenProvider: generateToken,
        });

        setClient(initClient);

        return () => {
            initClient.disconnectUser();
            setClient(undefined);
        }

    }, [generateToken, userId, userName, userImage]);

    const [call, setCall] = useState<Call>();

    useEffect(() => {
        if (!client) return;

        const initCall = client.call("default", meetingId);
        initCall.camera.disable();
        initCall.microphone.disable();

        //set the call 
        setCall(initCall);

        return () => {
            if (initCall.state.callingState !== CallingState.LEFT) {
                initCall.leave();
                initCall.endCall();
                setCall(undefined);
            }
        }

    }, [client, meetingId]);

    if (!client || !call) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-8 animate-spin text-white" />
            </div>
        )
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallUI meetingName={meetingName}/>
            </StreamCall>
        </StreamVideo>
    )
}