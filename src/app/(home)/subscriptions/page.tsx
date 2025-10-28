import SubscriptionsView from "@/modules/subscriptions/ui/views/subscriptions-view"
import { HydrateClient, trpc } from "@/trpc/server"

export default async function Page() {
    void trpc.subscriptions.getMany.prefetchInfinite({
        limit: 5
    })
    return (
        <HydrateClient>
            <SubscriptionsView />
        </HydrateClient>
    )
}
