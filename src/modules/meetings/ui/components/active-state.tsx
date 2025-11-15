import Link from "next/link";
import { VideoIcon } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

interface Props {
    meetingId: string,
}

export const ActiveState = ({ meetingId }: Props) => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-x-8 items-center justify-center">
            <EmptyState
                image="/upcoming.svg"
                title="Meeting is active"
                description="Meeting will end once all participant have left"
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full mt-4 pb-4">
                <Button asChild className="w-full lg:w-auto">
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon />
                        Join meeting
                    </Link>
                </Button>
            </div>
        </div>
    )
}