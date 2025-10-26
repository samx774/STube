"use client"

import { InfiniteScroll } from "@/components/infinite-scroll";
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";

interface PlaylistAddModalProps {
    open: boolean;
    videoId: string;
    onOpenChange: (open: boolean) => void;
}

export default function PlaylistAddModal({
    open,
    onOpenChange,
    videoId
}: PlaylistAddModalProps) {
    const utils = trpc.useUtils()
    const { data: playlists, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = trpc.playlists.getManyForVideo.useInfiniteQuery({
        limit: 10,
        videoId
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!videoId && open,
    })

    const addVideo = trpc.playlists.addVideo.useMutation({
        onSuccess: (data) => {
            toast.success("Video added to playlist")
            utils.playlists.getMany.invalidate()
            utils.playlists.getManyForVideo.invalidate({ videoId })
            utils.playlists.getOne.invalidate({ id: data.playlistId })
            utils.playlists.getVideos.invalidate({ playlistId: data.playlistId })
        },
        onError: () => {
            toast.error("Failed to add video to playlist")
        }
    })
    const removeVideo = trpc.playlists.removeVideo.useMutation({
        onSuccess: (data) => {
            toast.success("Video removed from playlist")
            utils.playlists.getManyForVideo.invalidate({ videoId })
            utils.playlists.getMany.invalidate()
            utils.playlists.getOne.invalidate({ id: data.playlistId })
            utils.playlists.getVideos.invalidate({ playlistId: data.playlistId })
        },
        onError: () => {
            toast.error("Failed to remove video from playlist")
        }
    })

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={"Add to playlist"}
        >
            <div className="flex flex-col gap-2">
                {isLoading && (
                    <div className="flex justify-center p-4">
                        <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!isLoading && (
                    playlists?.pages
                        .flatMap(page => page.items)
                        .map(playlist =>
                            <Button
                                key={playlist.id}
                                variant={"ghost"}
                                className="w-full justify-start px-2 [&_svg]:size-5"
                                size={"lg"}
                                onClick={() => {
                                    if (playlist.containsVideo) {
                                        removeVideo.mutate({
                                            playlistId: playlist.id,
                                            videoId
                                        })
                                    } else {
                                        addVideo.mutate({
                                            playlistId: playlist.id,
                                            videoId
                                        })
                                    }
                                }}
                                disabled={addVideo.isPending || removeVideo.isPending}
                            >
                                {playlist.containsVideo ? (
                                    <SquareCheckIcon className="mr-2" />
                                ) : (
                                    <SquareIcon className="mr-2" />
                                )}
                                {playlist.name}
                            </Button>
                        )
                )}
                {!isLoading && (
                    <InfiniteScroll
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        isManual
                        word="playlist"
                    />
                )}
            </div>

        </ResponsiveDialog>
    )
}
