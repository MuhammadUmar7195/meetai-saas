import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type AgentsGetMany = inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"];
export type AgentsGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
