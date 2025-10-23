
import TrendingView from "@/modules/home/ui/views/trending-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = 'force-dynamic';


export default async function Page() {
  void trpc.videos.getManyTrending.prefetchInfinite({ limit: 10 });
  return (
    <div>
      <HydrateClient>
        <TrendingView />
      </HydrateClient>
    </div>
  )
}
