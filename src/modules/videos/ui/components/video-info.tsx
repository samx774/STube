import { useMemo } from "react";
import { VideoGetManyOutput } from "../../types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
import UserInfo from "@/modules/users/ui/components/user-info";
import VideoMenu from "./video-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoInfoProps {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
}

export function VideoInfoSkeleton() {
    return(
        <div className="flex gap-3">
            <Skeleton className="size-12 rounded-full shrink-0"/>
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-[90%]"/>
                <Skeleton className="h-5 w-[70%]"/>
            </div>
        </div>
    )
}

export function VideoInfo({ data, onRemove }: VideoInfoProps) {
    const compactDate = useMemo(() => {
        return formatDistanceToNow(data.createdAt, {
            addSuffix: true,
        });
    }, [data.createdAt]);
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "compact",
        }).format(data.viewCount);
    }, [data.viewCount]);
    return (
        <div className="flex gap-3 mt-1 md:px-0 px-4">
            <Link className="md:hidden lg:block" href={`/users/${data.user.id}`}>
                <UserAvatar
                    name={data.user.name}
                    imageUrl={data.user.imageUrl}
                />
            </Link>
            <div className="min-w-0 flex-1">
                <Link href={`/videos/${data.id}`}>
                    <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
                        {data.title}
                    </h3>
                </Link>
                <Link href={`/users/${data.user.id}`}>
                    <UserInfo
                        name={data.user.name}
                    />
                </Link>
                <Link href={`/videos/${data.id}`}>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {compactViews} views • {compactDate}
                    </p>
                </Link>
            </div>
            <div className="shrink-0">
                <VideoMenu videoId={data.id} onRemove={onRemove} />
            </div>
        </div>
    )
}