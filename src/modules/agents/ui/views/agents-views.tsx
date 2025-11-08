"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";

import { LoadingStates } from "@/components/loading-states";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentFilter } from "../../hooks/use-agents-filter";
import { DataPagination } from "@/components/data-pagination";

export const AgentsView = () => {
    const router = useRouter();

    const [filters, setFilter] = useAgentFilter();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }));

    return (
        <>
            <div className="flex-1 pb-4 px-3 md:px-8 flex flex-col gap-y-4">
                <DataTable
                    data={data.items}
                    columns={columns}
                    onRowClick={(row) => router.push(`/agents/${row.id}`)} />
                <DataPagination
                    page={filters.page}
                    totalPage={data.totalPage}
                    onPageChange={(page) => setFilter({ page })}
                />
                {
                    data.items.length === 0 && (
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