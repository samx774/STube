"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import PlaylistGridCard, { PlaylistGridCardSkeleton } from "../components/playlist-grid-card";


export default function PlaylistsSection() {
    return (
        <Suspense fallback={<PlaylistSectionSkeleton />}>
            <ErrorBoundary fallback={<div>error</div>}>
                <PlaylistsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function PlaylistSectionSkeleton() {
    return (
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 px-4 lg:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6" >
            {Array.from({ length: 10 }).map((_, index) => (
                <PlaylistGridCardSkeleton key={index} />
            ))}
        </div>
    )
}

function PlaylistsSectionSuspense() {
    const [playlists, qurey] = trpc.playlists.getMany.useSuspenseInfiniteQuery({
        limit: 10,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    return (
        <div>

            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 px-4 lg:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6">
                {playlists.pages.flatMap(page => page.items)
                    .map(playlist =>
                        <PlaylistGridCard
                            key={playlist.id}
                            data={playlist}
                        />)}
            </div>
            <InfiniteScroll
                word="playlists"
                hasNextPage={qurey.hasNextPage}
                isFetchingNextPage={qurey.isFetchingNextPage}
                fetchNextPage={qurey.fetchNextPage}
            />
        </div>
    )
}
