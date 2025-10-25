import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface PlaylistThimbnailProps {
    title: string;
    videoCount: number;
    className?: string;
    imageUrl?: string | null;
}

export function PlaylistThumbnailSkeleton() {
    return (
        <div className="relative w-full overflow-hidden rounded-xl aspect-video">
            <Skeleton className="size-full" />
        </div>
    )
}

export default function PlaylistThumbnail({
    title,
    videoCount,
    className,
    imageUrl,
}: PlaylistThimbnailProps) {
    const compactVideos = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "compact",
        }).format(videoCount);
    }, [videoCount]);
    return (
        <div className={cn("relative pt-3", className)}>
            <div className="relative">
                <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl
                    bg-foreground/20 aspect-video"
                />
                <div
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl
                    bg-foreground/25 aspect-video"
                />
                <div className="relative overflow-hidden w-full rounded-xl aspect-video">
                    <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover"
                        fill
                    />
                    <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex items-center gap-x-2">
                            <PlayIcon className="size-4 text-background fill-background" />
                            <span className="text-background font-medium">Play all</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-foreground/80 text-background text-xs
            font-medium flex items-center gap-x-1">
                <ListVideoIcon className="size-4" />
                {compactVideos} videos
            </div>
        </div>
    );
};
