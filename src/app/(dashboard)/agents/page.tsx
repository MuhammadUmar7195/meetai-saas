import { AgentsError, AgentsLoading, AgentsView } from '@/modules/agents/ui/views/agents-views'
import ListHeader from '@/modules/agents/ui/components/agents-list-header';

import { ErrorBoundary } from 'react-error-boundary';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/trpc/server'
import { Suspense } from 'react'

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { SearchParams } from 'nuqs';
import { loadSearchParams } from '@/modules/agents/parms';

interface Props {
  searchParams: Promise<SearchParams>
}

const page = async ({ searchParams }: Props) => {

  const filter = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
    ...filter
  }));

  return (
    <>
      <ListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsLoading />}>
          <ErrorBoundary fallback={<AgentsError />}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default page
