import { AgentsError, AgentsLoading, AgentsView } from '@/modules/agents/ui/views/agents-views'
import ListHeader from '@/modules/agents/ui/components/agents-list-header';

import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/trpc/server'
import { Suspense } from 'react'

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
      <ListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsLoading />}>
          <ErrorBoundary errorComponent={AgentsError}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default page
