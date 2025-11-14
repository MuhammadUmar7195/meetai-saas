import MeetingListHeader from "@/modules/meetings/ui/components/meeting-list-header";
import { MeetingsError, MeetingsLoading, MeetingView } from "@/modules/meetings/ui/views/meetings-view"

import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loadSearchParams } from "@/modules/meetings/parms";
import { MeetingStatus } from "@/modules/meetings/type";

interface Props {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
  
  const filter = await loadSearchParams(searchParams);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({
    ...filter,
    status: filter.status === MeetingStatus.Completed ? null : filter.status,
    agentId: filter.agentId != null ? String(filter.agentId) : null,
  }));

  return (
    <>
      <MeetingListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsLoading />}>
          <ErrorBoundary fallback={<MeetingsError />}>
            <MeetingView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default Page;
