"use client"

import { InfiniteScroll } from "@/components/infinite-scroll"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Loader2Icon, LockIcon, LockOpenIcon } from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { format } from "date-fns"
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
import VideoThumbnail from "@/modules/videos/ui/components/video-thumbnail"

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
                                        <div className="flex items-center gap-4">
                                            <div className="relative aspect-video w-36 shrink-0">
                                                <VideoThumbnail duration={video.duration || 0} imageUrl={video.thumbnailUrl} previewUrl={video.previewUrl} title={video.title} />
                                            </div>
                                            <div className="flex flex-col overflow-hidden gap-y-1">
                                                <span className="line-clamp-1 text-sm">{video.title}</span>
                                                <span className="line-clamp-1 text-xs text-muted-foreground">{video.description || "No description"}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="capitalize flex items-center gap-2">
                                            {video.visibility === "private" ?
                                                <LockIcon className="size-4 me-1" />
                                                :
                                                <LockOpenIcon className="size-4 me-1" />
                                            }
                                            {video.visibility}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center capitalize">
                                            {video.muxStatus}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm truncate">
                                        {format(new Date(video.createdAt), "d MMM yyyy")}
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
