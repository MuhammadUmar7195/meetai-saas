"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingStates } from "@/components/loading-states";
import { ErrorState } from "@/components/error-state";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <>
            <div>{JSON.stringify(data, null, 2)}</div>
        </>
    )
}

export const AgentsLoading = () => {
    return (
        <LoadingStates title='Loading agents...' description='This may take a few seconds' />
    )
}

export const AgentsError = () => {
    return (
        <ErrorState title='Error loading agents' description='Please try again later' />
    )
}