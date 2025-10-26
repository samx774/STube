import VideosView from "@/modules/playlists/ui/views/videos-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{
        playlistId: string
    }>
}

export default async function Page({ params }: PageProps) {
    const { playlistId } = await params
    void trpc.playlists.getOne.prefetch({ id: playlistId })
    void trpc.playlists.getVideos.prefetchInfinite({
        playlistId,
        limit: 10,
    })
    return (
        <HydrateClient>
            <VideosView playlistId={playlistId} />
        </HydrateClient>
    )
}
