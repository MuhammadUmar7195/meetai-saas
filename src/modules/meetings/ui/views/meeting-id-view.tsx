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
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";
import { CompletedState } from "../components/completed-state";

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
            onSuccess: async () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions(),
                );
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

    const isActive = data.status === 'active';
    const isUpcoming = data.status === 'upcoming';
    const isCancelled = data.status === 'canceled';
    const isCompleted = data.status === 'completed';
    const isProcessing = data.status === 'processing';

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
                {isCancelled &&
                    <CancelledState />
                }
                {isProcessing &&
                    <ProcessingState />
                }
                {isCompleted &&
                    <CompletedState data={data} />
                }
                {isActive &&
                    <ActiveState
                        meetingId={meetingId}
                    />
                }
                {isUpcoming &&
                    <UpcomingState
                        meetingId={meetingId}
                        onCancelMeeting={() => { }}
                        isCancelling={false}
                    />
                }
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