import { DEFAULT_LIMIT } from "@/constants"
import StudioView from "@/modules/studio/ui/views/studio-view"
import { HydrateClient, trpc } from "@/trpc/server"

export default async function Page() {
    void trpc.studio.getMany.prefetchInfinite({
        limit: DEFAULT_LIMIT
    })
    return (
        <HydrateClient>
            <StudioView />
        </HydrateClient>
    )
}
