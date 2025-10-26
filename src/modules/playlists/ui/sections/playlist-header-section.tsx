"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/trpc/client"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { toast } from "sonner"

interface PlaylistHeaderSectionProps {
    playlistId: string
}

export default function PlaylistHeaderSection({ playlistId }: PlaylistHeaderSectionProps) {
    return (
        <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <PlaylistHeaderSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function PlaylistHeaderSectionSkeleton() {
    return (
        <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
        </div>
    )
}

function PlaylistHeaderSectionSuspense({ playlistId }: PlaylistHeaderSectionProps) {
    const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId })
    const router = useRouter()
    const utils = trpc.useUtils()
    const remove = trpc.playlists.remove.useMutation({
        onSuccess: () => {
            toast.success("Playlist removed");
            utils.playlists.getMany.invalidate()
            router.push("/playlists")
        },
        onError: () => {
            toast.error("Failed to remove playlist")
        }
    })

    return (
        <div className="flex justify-between px-4 items-center">
            <div>
                <h1 className="text-2xl font-bold">{playlist.name}</h1>
                <p className="text-xs text-muted-foreground">Videos from the playlist</p>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => {
                    remove.mutate({ id: playlistId })
                }}
                disabled={remove.isPending}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}
