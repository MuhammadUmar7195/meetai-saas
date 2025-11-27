import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { auth } from "@/lib/auth";
import { ErrorBoundary } from "react-error-boundary";
import {
    UpgradeViews,
    UpgradeViewsError,
    UpgradeViewsLoading
} from "@/modules/premium/ui/views/upgrade-views";

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.premium.getCurrentSubscription.queryOptions())
    void queryClient.prefetchQuery(trpc.premium.getProducts.queryOptions());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<UpgradeViewsLoading />}>
                <ErrorBoundary fallback={<UpgradeViewsError />}>
                    <UpgradeViews />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;
