"use client"

import { trpc } from "@/trpc/client"
import { DEFAULT_LIMIT } from "@/constants"
import { VideoRowCard, VideoRowCardSkeleton } from "../components/video-row-card"
import { VideoGridCard, VideoGridCardSkeleton } from "../components/video-grid-card"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface suggestionsSectionProps {
    videoId: string;
    isManual?: boolean
}

export default function SuggestionsSection({ videoId, isManual }: suggestionsSectionProps) {
    return (
        <Suspense fallback={<SuggestionsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
            </ErrorBoundary>
        </Suspense>
    )
}

function SuggestionsSectionSkeleton() {
    return (
        <>
            <div className="hidden lg:block space-y-3">
                {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                    <VideoRowCardSkeleton
                        key={index}
                        size="default"
                    />
                ))}
            </div>
            <div className="lg:hidden grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                    <VideoGridCardSkeleton
                        key={index}
                    />
                ))}
            </div>
        </>
    )
}

function SuggestionsSectionSuspense({ videoId, isManual }: suggestionsSectionProps) {
    const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
    return (
        <>
            <div className="hidden lg:block space-y-1.5">
                {suggestions.pages.flatMap(page => page.items).map((video) => (
                    <VideoRowCard
                        key={video.id}
                        data={video}
                        size="compact"
                    />
                ))}
            </div>
            <div className="lg:hidden block space-y-3">
                <div className="grid md:grid-cols-3 sm:grid-cols-2  gap-2">
                    {suggestions.pages.flatMap(page => page.items).map((video) => (
                        <VideoGridCard
                            key={video.id}
                            data={video}
                        />
                    ))}
                </div>
            </div>
            <InfiniteScroll
                isManual={isManual}
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
                word="videos"
            />
        </>
    )
}
