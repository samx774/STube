import LikedView from "@/modules/playlists/ui/views/liked-view";
import { HydrateClient, trpc } from "@/trpc/server";


export default async function Page() {
    void trpc.playlists.getLiked.prefetchInfinite({
        limit: 10,
    })
    return (
        <HydrateClient>
            <LikedView />
        </HydrateClient>
    )
}
