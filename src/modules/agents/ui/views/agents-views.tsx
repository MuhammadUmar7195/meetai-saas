"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingStates } from "@/components/loading-states";
import { ErrorState } from "@/components/error-state";

import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <>
            <div className="flex-1 pb-4 px-3 md:px-8 flex flex-col gap-y-4">
                <DataTable data={data} columns={columns} />
                {
                    data.length === 0 && (
                        <EmptyState title="Create your first agent" description="Create an agent that join the meetings. Each agent follows your instructions and can interact with participants during the call." />
                    )
                }
            </div>
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