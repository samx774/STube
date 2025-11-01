import { UserView } from "@/modules/users/ui/views/user-view"
import { HydrateClient, trpc } from "@/trpc/server"
import { Metadata } from "next"

interface PageProps {
    params: Promise<{
        userId: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { userId } = await params
    const user = await trpc.users.getOne({ id: userId })
    return {
        title: `${user.name}`,
        description: `Watch videos uploaded by ${user.name}`,
        openGraph: {
            title: `${user.name}`,
            description: `Watch videos uploaded by ${user.name}`,
            images: [
                {
                    url: user.imageUrl ?? "/user-placeholder.jpg",
                    width: 1280,
                    height: 720,
                },
            ],
        },
    }
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