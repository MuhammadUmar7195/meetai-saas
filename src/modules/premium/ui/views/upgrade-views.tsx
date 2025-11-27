"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingStates } from "@/components/loading-states";
import { authClient } from "@/lib/auth-client";
import { PrizingCard } from "../components/prizing-card";

export const UpgradeViews = () => {
    const trpc = useTRPC();

    const { data: products } = useSuspenseQuery(
        trpc.premium.getProducts.queryOptions(),
    );

    const { data: currentSubscription } = useSuspenseQuery(
        trpc.premium.getCurrentSubscription.queryOptions(),
    );

    return (
        <>
            <div className="flex-1 px-4 py-4 md:px-8 flex flex-col gap-y-10">
                <div className="mt-4 flex-1 flex flex-col gap-y-10 items-center">
                    <h5 className="text-2xl font-medium md:text-3xl">
                        You are on the {" "}
                        <span className="text-primary font-semibold">
                            {currentSubscription?.name ?? 'Free'}
                        </span> {" "}
                        Plan
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {products?.map((product) => {
                            const isPremium = !!currentSubscription;
                            const isCurrentProduct = currentSubscription?.id === product.id;

                            let buttonText = "Upgrade Now";
                            let onClick = () => authClient.checkout({ products: [product.id] });

                            if (isCurrentProduct) {
                                buttonText = "Manage";
                                onClick = () => authClient.customer.portal();
                            } else if (isPremium) {
                                buttonText = "Switch Plan";
                                onClick = () => authClient.customer.portal();
                            }
                            return (
                                <>
                                    <PrizingCard
                                        key={product.id}
                                        buttonText={buttonText}
                                        onClick={onClick}
                                        variant={
                                            product.metadata.variant === "highlighted" ? "highlighted" : "default"
                                        }
                                        price={
                                            product.prices[0].amountType === "fixed"
                                                ? (product.prices[0].priceAmount / 100).toString()
                                                : "0"
                                        }
                                        title={product.name}
                                        description={product.description}
                                        priceSuffix={`/${product.prices[0].recurringInterval}`}
                                        features={product.benefits.map((benefit) => benefit.description)}
                                        badge={product.metadata.badge as string | null}
                                    />
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
};

export const UpgradeViewsLoading = () => {
    return (
        <LoadingStates title="Loading..." description="This may take a few seconds." />
    )
}

export const UpgradeViewsError = () => {
    return (
        <ErrorState title="Error" description="Please try again later." />
    )
}
