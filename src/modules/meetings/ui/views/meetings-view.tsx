"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingStates } from "@/components/loading-states";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const MeetingView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
    
    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
}

export const MeetingsLoading = () => {
    return (
        <LoadingStates title='Loading meetings...' description='This may take a few seconds' />
    )
}

export const MeetingsError = () => {
    return (
        <ErrorState title='Error loading meetings' description='Please try again later' />
    )
}
