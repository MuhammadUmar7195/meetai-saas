"use client";

import { useState } from 'react';

import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { VideoIcon } from 'lucide-react';
import { toast } from 'sonner';

import { LoadingStates } from '@/components/loading-states';
import { ErrorState } from '@/components/error-state';
import { GenerateAvatar } from '@/components/generateAvatar';
import AgentIdViewHeader from '../components/agent-id-view-header';
import UpdateAgentDialog from '../components/update-agent-dialog';
import { Badge } from '@/components/ui/badge';
import { useConfirm } from '@/hooks/use-confirm';

interface AgentIdViewProps {
    agentId: string;
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const [updateAgentDialog, setUpdateAgentDialog] = useState(false);

    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                //Invalidate free tier usage
                router.push('/agents');
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }),
    )

    // for confirmation dialog, later
    const [confirmRemove, RemoveConfirmation] = useConfirm(
        `Are you sure?`,
        `The following action will remove ${data.meetingCount} meetings associated with this agent. This action cannot be undone.`,
    )

    const handleRemove = async () => {
        // confirmRemove likely shows a modal and returns a Promise<boolean>
        const ok = await confirmRemove();

        if (!ok) return;

        await removeAgent.mutateAsync({ id: agentId });
    }

    return (
        <>
            <RemoveConfirmation />
            <UpdateAgentDialog
                open={updateAgentDialog}
                onOpenChange={setUpdateAgentDialog}
                initialValues={data}
            />
            <div className='flex-1 flex flex-col gap-y-4 py-4 px-4 md:px-8'>
                <AgentIdViewHeader
                    agentId={agentId}
                    agentName={data.name}
                    onEdit={() => setUpdateAgentDialog(true)}
                    onRemove={handleRemove}
                />

                <div className='bg-white rounded-lg border'>
                    <div className='py-5 px-4 flex flex-col col-span-6 gap-y-5'>
                        <div className='flex items-center gap-x-3'>
                            <GenerateAvatar
                                variant="botttsNeutral"
                                seed={data.name}
                                className='size-10 rounded-md'
                            />
                            <h2 className="text-2xl font-medium">{data.name}</h2>
                        </div>
                        <Badge
                            variant="outline"
                            className='flex items-center gap-x-2 w-fit [&>svg]:size-4'
                        >
                            <VideoIcon className='text-blue-700' />
                            {data.meetingCount} {data.meetingCount > 1 ? "Meetings" : "Meeting"}
                        </Badge>
                        <div className='flex flex-col gap-y-4'>
                            <p className='text-lg font-medium'>Instruction </p>
                            <p className='text-neutral-800'>{data.instructions}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const AgentIdViewLoading = () => {
    return (
        <LoadingStates title='Loading agents...' description='This may take a few seconds' />
    )
}

export const AgentIdViewError = () => {
    return (
        <ErrorState title='Error loading agents' description='Please try again later' />
    )
}
