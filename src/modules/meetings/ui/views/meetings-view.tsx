"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingStates } from "@/components/loading-states";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { MeetingStatus } from "../../type";
import { DataPagination } from "@/components/data-pagination";

export const MeetingView = () => {
    const trpc = useTRPC();
    const router = useRouter();

    const [filters, setFilters] = useMeetingsFilter();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters,
        status: filters.status === MeetingStatus.Completed ? undefined : filters.status,
        agentId: filters.agentId != null ? String(filters.agentId) : null,  
    }));

    return (
        <div className="flex-1 pb-4 px-3 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data?.items} columns={columns} onRowClick={(row) => router.push(`/meetings/${row.id}`)}/>
            <DataPagination 
                page={filters.page}
                totalPage={data.totalPage}
                onPageChange={(page) => setFilters({ page })}
            />
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
