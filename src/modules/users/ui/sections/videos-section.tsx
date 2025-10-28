"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface VideosSectionProps {
    userId: string;
}

export default function VideosSection(props: VideosSectionProps) {
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>error</div>}>
                <VideosSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}

function VideosSectionSkeleton() {
    return (
        <div className="gap-4 gap-y-5 grid grid-cols-1 sm:grid-cols-2 sm:px-4 lg:grid-cols-3 2xl:grid-cols-4 " >
            {Array.from({ length: 10 }).map((_, index) => (
                <VideoGridCardSkeleton key={index} />
            ))}
        </div>
    )
}

function VideosSectionSuspense({ userId }: VideosSectionProps) {
    const [videos, qurey] = trpc.videos.getMany.useSuspenseInfiniteQuery({
        limit: 10,
        userId
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    return (
        <div>
            <div className="gap-4 gap-y-5 grid grid-cols-1 sm:grid-cols-2 sm:px-4 lg:grid-cols-3 2xl:grid-cols-4 " >
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
