"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface VideosSectionProps {
    playlistId: string
}

export default function VideosSection({ playlistId }: VideosSectionProps) {
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>error</div>}>
                <VideosSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function VideosSectionSkeleton() {
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

function VideosSectionSuspense({ playlistId }: VideosSectionProps) {
    const utils = trpc.useUtils()
    const [videos, qurey] = trpc.playlists.getVideos.useSuspenseInfiniteQuery({
        playlistId,
        limit: 10,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    const removeVideo = trpc.playlists.removeVideo.useMutation({
        onSuccess: (data) => {
            toast.success("Video removed from playlist")
            utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId })
            utils.playlists.getMany.invalidate()
            utils.playlists.getOne.invalidate({ id: data.playlistId })
            utils.playlists.getVideos.invalidate({ playlistId: data.playlistId })
        },
        onError: () => {
            toast.error("Failed to remove video from playlist")
        }
    })
    return (
        <div>

            <div className="flex flex-col gap-4 gap-y-5 md:hidden">
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoGridCard key={video.id} data={video} onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })} />
                ))}
            </div>
            <div className="md:flex flex-col gap-2 hidden">
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoRowCard key={video.id} data={video} size={"compact"} onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })} />
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
