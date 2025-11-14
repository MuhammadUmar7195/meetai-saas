"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingStates } from "@/components/loading-states";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const MeetingView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return (
        <div className="flex-1 pb-4 px-3 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data?.items} columns={columns} />
            {
                data.items.length === 0 && (
                    <EmptyState
                        title="Create your first meeting"
                        description="Schedule a meeting to get started. Each meeting can have multiple agents interacting with participants in real time."
                    />
                )
            }
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
