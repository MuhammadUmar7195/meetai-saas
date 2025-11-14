import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];

export enum MeetingStatus {
  Upcoming = "upcoming",
  Processing = "processing",
  Active = "active",
  Canceled = "canceled",
  Completed = "completed",
}
