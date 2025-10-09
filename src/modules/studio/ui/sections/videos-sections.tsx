"use client"

import { InfiniteScroll } from "@/components/infinite-scroll"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Loader2Icon } from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"

export const VideosSection = () => {
    return (
        <Suspense fallback={<Loader2Icon className="animate-spin" />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function VideosSectionSuspense() {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="ps-6 w-[510px]">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Stauts</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-end">Views</TableHead>
                            <TableHead className="text-end">Comments</TableHead>
                            <TableHead className="text-end pe-6">Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages.flatMap(page => page.items).map(video => (
                            <Link key={video.id} href={`/studio/videos/${video.id}`} legacyBehavior>
                                <TableRow className="cursor-pointer">
                                    <TableCell>
                                        {video.title}
                                    </TableCell>
                                    <TableCell>
                                        Visibility
                                    </TableCell>
                                    <TableCell>
                                        status
                                    </TableCell>
                                    <TableCell>
                                        date
                                    </TableCell>
                                    <TableCell>
                                        views
                                    </TableCell>
                                    <TableCell>
                                        comments
                                    </TableCell>
                                    <TableCell>
                                        likes
                                    </TableCell>
                                </TableRow>
                            </Link>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll
                isManual
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}
