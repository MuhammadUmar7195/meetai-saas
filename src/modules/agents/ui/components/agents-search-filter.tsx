import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAgentFilter } from "../../hooks/use-agents-filter";

export const AgentsSearchFilter = () => {
    const [filter, setFilter] = useAgentFilter();

    return (
        <div className="relative">
            <Input
                type="text"
                placeholder="filter by name"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="h-9 bg-white w-[200px] pl-7"
            />
            <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
    );
}
