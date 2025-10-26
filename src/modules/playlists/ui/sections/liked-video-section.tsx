"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


export default function LikedVideosSection() {
    return (
        <Suspense fallback={<LikedVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>error</div>}>
                <LikedVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function LikedVideosSectionSkeleton() {
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-5 md:hidden" >
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
            <div className="hidden flex-col gap-4 md:flex" >
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoRowCardSkeleton size={"compact"} key={index} />
                ))}
            </div>
        </div>
    )
}

function LikedVideosSectionSuspense() {
    const [videos, qurey] = trpc.playlists.getLiked.useSuspenseInfiniteQuery({
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
