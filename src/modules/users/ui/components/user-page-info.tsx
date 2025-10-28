import UserAvatar from "@/components/user-avatar";
import { UserGetOneOutput } from "../../types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SubscriptionButton from "@/modules/subscriptions/ui/components/subscription-button";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface UserPageInfoProps {
    user: UserGetOneOutput
}

export function UserPageInfoSkeleton() {
    return (
        <div className="py-6">
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-[60px] rounded-full" />
                    <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-3 w-48 rounded mt-1" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full rounded mt-3" />
            </div>

            <div className="hidden md:flex items-start gap-4">
                <Skeleton className="size-[160px] rounded-full" />
                <div className="flex-1 min-w-0">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-48 mt-4" />
                    <Skeleton className="h-10 w-32 rounded-full mt-3" />
                </div>
            </div>
        </div>
    )
}

export function UserPageInfo({ user }: UserPageInfoProps) {
    const { userId, isLoaded } = useAuth()
    const { onClick, isPending } = useSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
    })
    const clerk = useClerk()
    return (
        <div className="py-6">
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        size="lg"
                        imageUrl={user.imageUrl}
                        name={user.name}
                        className="size-[60px]"
                        onClick={() => {
                            if (user.clerkId === userId) {
                                clerk.openUserProfile()
                            }
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold">{user.name}</h1>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <span>{user.subscriptionCount} subscribers</span>
                            <span>•</span>
                            <span>{user.videoCount} videos</span>
                        </div>
                    </div>
                </div>
                {userId === user.clerkId ? (
                    <Button
                        variant={"secondary"}
                        asChild
                        className="w-full mt-3 rounded-full"
                    >
                        <Link prefetch  href={'/studio'}>Go to studio</Link>
                    </Button>
                ) : (
                    <SubscriptionButton
                        onClick={onClick}
                        disabled={isPending || !isLoaded}
                        isSubscribed={user.viewerSubscribed}
                        className="w-full mt-3"
                    />
                )}
            </div>

            <div className="hidden md:flex items-start gap-4">
                <UserAvatar
                    size="xl"
                    imageUrl={user.imageUrl}
                    name={user.name}
                    className={cn(userId === user.clerkId && "cursor-pointer hover:opacity-80 transition-opacity duration-300")}
                    onClick={() => {
                        if (user.clerkId === userId) {
                            clerk.openUserProfile()
                        }
                    }}
                />
                <div className="flex-1 min-w-0">
                    <h1 className="text-4xl font-bold">{user.name}</h1>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
                        <span>{user.subscriptionCount} subscribers</span>
                        <span>•</span>
                        <span>{user.videoCount} videos</span>
                    </div>
                    {userId === user.clerkId ? (
                        <Button
                            variant={"secondary"}
                            asChild
                            className="mt-3 rounded-full"
                        >
                            <Link prefetch  href={'/studio'}>Go to studio</Link>
                        </Button>
                    ) : (
                        <SubscriptionButton
                            onClick={onClick}
                            disabled={isPending || !isLoaded}
                            isSubscribed={user.viewerSubscribed}
                            className="mt-3"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}