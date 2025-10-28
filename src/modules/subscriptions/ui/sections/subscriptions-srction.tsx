"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import SubscriptionItem, { SubscriptionItemSkeleton } from "../components/subscription-item";


export default function SubscriptionsSection() {
    return (
        <Suspense fallback={<SubscriptionsSectionSkeleton />}>
            <ErrorBoundary fallback={<div>error</div>}>
                <SubscriptionsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function SubscriptionsSectionSkeleton() {
    return (
        <div>
            <div className="flex flex-col gap-4" >
                {Array.from({ length: 10 }).map((_, index) => (
                    <SubscriptionItemSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}

function SubscriptionsSectionSuspense() {
    const utils = trpc.useUtils();
    const [subscriptions, qurey] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery({
        limit: 10,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: (data) => {
            toast.success("Unsubscribed")
            utils.videos.getManySubscribed.invalidate()
            utils.users.getOne.invalidate({ id: data.creatorId })
            utils.subscriptions.getMany.invalidate()
        },
        onError: () => {
            toast.error("Failed to unsubscribe")
        }
    })
    return (
        <div>

            <div className="flex flex-col gap-4">
                {subscriptions.pages.flatMap(page => page.items).map(subscription => (
                        <SubscriptionItem
                            user={subscription.user.id}
                            name={subscription.user.name}
                            imageUrl={subscription.user.imageUrl}
                            subscriberCount={subscription.user.subscriberCount}
                            onUnsubscribe={() => unsubscribe.mutate({
                                userId: subscription.user.id
                            })}
                            disabled={unsubscribe.isPending}
                        />
                ))}
            </div>
            <InfiniteScroll
                word="videos"
                hasNextPage={qurey.hasNextPage}
                isFetchingNextPage={qurey.isFetchingNextPage}
                fetchNextPage={qurey.fetchNextPage}
            />
        </div>
    )
}
