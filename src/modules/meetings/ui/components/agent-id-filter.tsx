import { useState } from "react";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { CommandSelect } from "@/components/command-select";
import { GenerateAvatar } from "@/components/generateAvatar";


export const AgentIdFilter = () => {
    const [filter, setFilter] = useMeetingsFilter();

    const trcp = useTRPC();

    const [agentSearch, setAgentSearch] = useState("");

    const { data } = useQuery(
        trcp.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        }),
    )

    return (
        <>
            <CommandSelect
                placeholder="Agent"
                className="h-9"
                options={(data?.items || []).map((agent) => ({
                    id: agent.id,
                    value: agent.id,
                    children: (
                        <div className="flex items-center gap-x-2">
                            <GenerateAvatar
                                seed={agent.name}
                                variant="botttsNeutral"
                                className="size-5 rounded-full"
                            />
                            <span>{agent.name}</span>
                        </div>
                    )
                }))}
                onSelect={(value) => setFilter({ agentId: value })}
                onSearch={setAgentSearch}
                value={filter.agentId ?? ""}
            />
        </>
    )
}