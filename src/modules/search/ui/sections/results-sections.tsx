"use client"

import { InfiniteScroll } from "@/components/infinite-scroll";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense, useLayoutEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ResultsSectionProps {
    query: string | undefined;
    categoryId: string | undefined;
}

export default function ResultsSection(props: ResultsSectionProps) {
    return (
        <Suspense
            key={`${props.query} - ${props.categoryId}`}
            fallback={<ResultsSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <ResultsSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}

function ResultsSectionSkeleton() {
    return (
        <div>
            <div className="hidden flex-col gap-4 md:flex">
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} />
                ))}
            </div>
            <div className="flex flex-col gap-4 gap-y-10 pt-6 md:hidden">
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}

function ResultsSectionSuspense({ query, categoryId }: ResultsSectionProps) {
    const isMobile = useIsMobile()
    const { setOpen } = useSidebar()
    const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery({
        query,
        categoryId,
        limit: 10,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
    useLayoutEffect(() => {
        setOpen(false)
    }, [query])
    return (
        <>
            {isMobile ? (
                <div className="flex flex-col gap-4 gap-y-10">
                    {results.pages.flatMap(page => page.items).map(video => (
                        <VideoGridCard key={video.id} data={video} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {results.pages.flatMap(page => page.items).map(video => (
                        <VideoRowCard key={video.id} data={video} />
                    ))}
                </div>
            )}
            <InfiniteScroll
                word="videos"
                hasNextPage={resultsQuery.hasNextPage}
                fetchNextPage={resultsQuery.fetchNextPage}
                isFetchingNextPage={resultsQuery.isFetchingNextPage}
            />
        </>
    )
}