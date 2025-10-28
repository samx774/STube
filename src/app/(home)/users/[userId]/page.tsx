import { UserView } from "@/modules/users/ui/views/user-view"
import { HydrateClient, trpc } from "@/trpc/server"

interface PageProps {
    params: Promise<{
        userId: string
    }>
}

export default async function Page({ params }: PageProps) {
    const { userId } = await params
    void trpc.users.getOne.prefetch({ id: userId })
    void trpc.videos.getMany.prefetchInfinite({ userId, limit: 10 })
    return (
        <HydrateClient>
            <UserView userId={userId} />
        </HydrateClient>
    )
}