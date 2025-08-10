import { AgentsError, AgentsLoading, AgentsView } from '@/modules/agents/ui/views/agents-views'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import React, { Suspense } from 'react'

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsLoading />}>
        <ErrorBoundary errorComponent={AgentsError}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page
