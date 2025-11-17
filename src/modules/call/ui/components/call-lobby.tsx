"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

import { LogInIcon } from "lucide-react";
import {
    DefaultVideoPlaceholder,
    StreamVideoParticipant,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview
} from "@stream-io/video-react-sdk"

import { generateAvatarUri } from "@/lib/avatar-stream";
import { Button } from "@/components/ui/button";

import "@stream-io/video-react-sdk/dist/css/styles.css"


interface Props {
    onJoin: () => void;
}

export const CallLobby = ({ onJoin }: Props) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserPermission = hasCameraPermission && hasMicPermission;

    //Disable PermissionCall handler
    const DisabledVideoPreview = () => {
        const { data } = authClient.useSession();

        const hasName = data?.user.name as string;
        const hasImage = data?.user.image as string;

        return (
            <DefaultVideoPlaceholder
                participant={{
                    name: hasName ?? "",
                    image:
                        hasImage ??
                        generateAvatarUri({
                            seed: data?.user.name ?? "",
                            variant: "initials"
                        })
                } as StreamVideoParticipant
                }
            />
        )
    }

    //Allowed Permission Call handler
    const AllowedVideoPreview = () => {
        return (
            <p className="text-sm">
                Please grant camera & microphone permission to your browser before starting this call.
            </p>
        )
    }


    return (
        <div className="flex flex-col items-center justify-center bg-radial from-sidebar-accent-foreground to-sidebar h-screen overflow-auto">
            <div className="w-full max-w-2xl py-4 px-8 flex flex-1 items-center justify-center">
                <div className="w-full flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-lg font-medium">Ready to Join?</h6>
                        <p className="text-muted-foreground">Set up your call before joining</p>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <VideoPreview
                            DisabledVideoPreview={
                                hasBrowserPermission ? DisabledVideoPreview : AllowedVideoPreview
                            }
                        />
                    </div>
                    <div className="flex gap-x-2">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>
                    <div className="flex gap-x-2 justify-center w-full">
                        <Button asChild variant="ghost">
                            <Link href={`/meetings`}>
                                Cancel
                            </Link>
                        </Button>
                        <Button onClick={onJoin}>
                            <LogInIcon />
                            Join Call
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}