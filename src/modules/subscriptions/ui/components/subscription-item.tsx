import UserAvatar from "@/components/user-avatar";
import SubscriptionButton from "./subscription-button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionItemProps {
    user: string
    name: string;
    imageUrl: string;
    subscriberCount: number;
    disabled: boolean;
    onUnsubscribe: () => void;
}

export function SubscriptionItemSkeleton() {
    return (
        <div className="flex items-start gap-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20 mt-1" />
                    </div>
                    <Skeleton className="h-8 w-20 " />
                </div>
            </div>
        </div>
    )
}

export default function SubscriptionItem({
    name,
    imageUrl,
    user,
    subscriberCount,
    disabled,
    onUnsubscribe,
}: SubscriptionItemProps) {
    return (
        <div className="flex items-center gap-4">
            <Link href={`/users/${user}`}>
                <UserAvatar
                    size={"lg"}
                    imageUrl={imageUrl}
                    name={name}
                />
            </Link>

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <Link href={`/users/${user}`}>
                        <div>
                            <h3 className="text-sm font-medium">{name}</h3>
                            <p className="text-xs text-muted-foreground">{subscriberCount.toLocaleString()} subscribers</p>
                        </div>
                    </Link>
                    <SubscriptionButton
                        size={"sm"}
                        onClick={onUnsubscribe}
                        disabled={disabled}
                        isSubscribed
                    />
                </div>
            </div>
        </div>
    )
}
