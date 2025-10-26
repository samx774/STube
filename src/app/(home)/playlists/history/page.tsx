import HistoryView from "@/modules/playlists/ui/views/history-view";
import { HydrateClient, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic"

export default async function Page() {
    void trpc.playlists.getHistory.prefetchInfinite({
        limit: 10,
    })
    return (
        <HydrateClient>
            <HistoryView />
        </HydrateClient>
    )
}
