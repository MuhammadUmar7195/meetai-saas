"use client";

import { ErrorState } from '@/components/error-state';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

import { LoadingStates } from '@/components/loading-states';
import { GenerateAvatar } from '@/components/generateAvatar';
import AgentIdViewHeader from '../components/agent-id-view-header';
import { Badge } from '@/components/ui/badge';
import { VideoIcon } from 'lucide-react';

interface AgentIdViewProps {
    agentId: string;
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
    const trpc = useTRPC();

    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

    return (
        <div className='flex-1 flex flex-col gap-y-4 py-4 px-4 md:px-8'>
            <AgentIdViewHeader
                agentId={agentId}
                agentName={data.name}
                onEdit={() => { }}
                onRemove={() => { }}
            />

            <div className='bg-white rounded-lg border'>
                <div className='py-5 px-4 flex flex-col col-span-6 gap-y-5'>
                    <div className='flex item-center gap-x-3'>
                        <GenerateAvatar
                            variant="botttsNeutral"
                            seed={data.name}
                            className='size-10 rounded-md'
                        />
                        <h2 className="" text-2xl font-medium>{data.name}</h2>
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
