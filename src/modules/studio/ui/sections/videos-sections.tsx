"use client"

import { InfiniteScroll } from "@/components/infinite-scroll"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { DEFAULT_LIMIT } from "@/constants"
import VideoThumbnail from "@/modules/videos/ui/components/video-thumbnail"
import { trpc } from "@/trpc/client"
import { format } from "date-fns"
import { Globe2Icon, LockIcon } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export const VideosSection = () => {
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function VideosSectionSkeleton() {
    return (
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
                    {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell className="pl-6">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-20 w-36" />
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-4 w-[100px]" />
                                        <Skeleton className="h-3 w-[150px]" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell className="ml-auto">
                                <Skeleton className="h-4 w-12" />
                            </TableCell>
                            <TableCell className="ml-auto">
                                <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell className="ml-auto pe-6">
                                <Skeleton className="h-4 w-full" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
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
                                    <TableCell className="ps-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative aspect-video w-36 shrink-0">
                                                <VideoThumbnail duration={video.duration || 0} imageUrl={video.thumbnailUrl} previewUrl={video.previewUrl} title={video.title} />
                                            </div>
                                            <div className="flex flex-col overflow-hidden gap-y-1">
                                                <span className="line-clamp-1 text-sm">{video.title}</span>
                                                <p className="line-clamp-1 w-[200px] text-xs text-muted-foreground">{video.description || "No description"}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="capitalize flex items-center gap-2">
                                            {video.visibility === "private" ?
                                                <LockIcon className="size-4 me-1" />
                                                :
                                                <Globe2Icon className="size-4 me-1" />
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
                                    <TableCell className="text-end">
                                        {video.viewCount}
                                    </TableCell>
                                    <TableCell className="text-end">
                                        {video.commentCount}
                                    </TableCell>
                                    <TableCell className="text-end pe-6">
                                        {video.likeCount}
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
