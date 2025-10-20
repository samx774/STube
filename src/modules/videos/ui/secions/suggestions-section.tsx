"use client"

import { trpc } from "@/trpc/client"
import { DEFAULT_LIMIT } from "@/constants"
import { VideoRowCard } from "../components/video-row-card"
import { VideoGridCard } from "../components/video-grid-card"
import { InfiniteScroll } from "@/components/infinite-scroll"

interface suggestionsSectionProps {
    videoId: string;
    isManual?: boolean
}

export default function SuggestionsSection({ videoId, isManual }: suggestionsSectionProps) {
    const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
    return (
        <>
            <div className="hidden xl:block space-y-3">
                {suggestions.pages.flatMap(page => page.items).map((video) => (
                    <VideoRowCard
                        key={video.id}
                        data={video}
                        size="compact"
                    />
                ))}
            </div>
            <div className="xl:hidden block space-y-3">
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-2">
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
