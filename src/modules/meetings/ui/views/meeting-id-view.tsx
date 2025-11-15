"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { useConfirm } from "@/hooks/use-confirm";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery
} from "@tanstack/react-query";

import MeetingIdViewHeader from "../components/meeting-id-view-header";
import { ErrorState } from "@/components/error-state";
import { LoadingStates } from "@/components/loading-states";
import UpdateMeetingDialog from "../components/update-meeting-dialog";

interface MeetingIdView {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: MeetingIdView) => {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const [updateMeetingDialog, setUpdateMeetingDialog] = useState(false);

    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                // TODO : Invalidate the free tier usage
                router.push('/meetings');
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    )

    // for confirmation dialog, later
    const [confirmRemove, RemoveConfirmation] = useConfirm(
        `Are you sure?`,
        `The following action will remove this meeting`,
    )

    const handleRemove = async () => {
        // confirmRemove likely shows a modal and returns a Promise<boolean>
        const ok = await confirmRemove();

        if (!ok) return;

        await removeMeeting.mutateAsync({ id: meetingId });
    }

    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog
                open={updateMeetingDialog}
                onOpenChange={setUpdateMeetingDialog}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => setUpdateMeetingDialog(true)}
                    onRemove={handleRemove}
                />
                {JSON.stringify(data, null, 2)}
            </div>
        </>
    )
}

export const MeetingIdViewLoading = () => {
    return (
        <LoadingStates title='Loading agents...' description='This may take a few seconds' />
    )
}

export const MeetingIdViewError = () => {
    return (
        <ErrorState title='Error loading agents' description='Please try again later' />
    )
}