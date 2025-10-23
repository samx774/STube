"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


export default function SubscribedVideosSection() {
    return (
        <Suspense fallback={<SubscribedVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>error</div>}>
                <SubscribedVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function SubscribedVideosSectionSkeleton() {
    return (
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 sm:px-4 lg:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6" >
            {Array.from({ length: 10 }).map((_, index) => (
                <VideoGridCardSkeleton key={index} />
            ))}
        </div>
    )
}

function SubscribedVideosSectionSuspense() {
    const [videos, qurey] = trpc.videos.getManySubscribed.useSuspenseInfiniteQuery({
        limit: 10,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 sm:px-4 lg:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6" >
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoGridCard key={video.id} data={video} />
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
