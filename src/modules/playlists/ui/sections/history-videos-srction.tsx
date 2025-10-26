"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


export default function HistoryVideosSection() {
    return (
        <Suspense fallback={<HistoryVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>error</div>}>
                <HistoryVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function HistoryVideosSectionSkeleton() {
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-5 md:hidden" >
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
            <div className="hidden flex-col gap-2 md:flex" >
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoRowCardSkeleton size={"compact"} key={index} />
                ))}
            </div>
        </div>
    )
}

function HistoryVideosSectionSuspense() {
    const [videos, qurey] = trpc.playlists.getHistory.useSuspenseInfiniteQuery({
        limit: 10,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    return (
        <div>

            <div className="flex flex-col gap-4 gap-y-5 md:hidden">
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoGridCard key={video.id} data={video} />
                ))}
            </div>
            <div className="md:flex flex-col gap-2 hidden">
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoRowCard key={video.id} data={video} size={"compact"} />
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
