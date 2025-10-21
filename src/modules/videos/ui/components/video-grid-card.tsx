import Link from "next/link";
import { VideoGetManyOutput } from "../../types";
import VideoThumbnail, { VideoThumbnailSkeleton } from "./video-thumbnail";
import { VideoInfo, VideoInfoSkeleton } from "./video-info";

interface VideoGridCardProps {
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
}

export function VideoGridCardSkeleton() {
    return (
        <div className="flex flex-col gap-2 w-full">
            <VideoThumbnailSkeleton />
            <VideoInfoSkeleton />
        </div>
    )
}

export function VideoGridCard({ data, onRemove }: VideoGridCardProps) {
    return (
        <div className="flex flex-col gap-2 w-full group">
            <Link href={`/videos/${data.id}`}>
                <VideoThumbnail
                    title={data.title}
                    duration={data.duration}
                    imageUrl={data.thumbnailUrl}
                    previewUrl={data.previewUrl}
                />
            </Link>
            <VideoInfo data={data} onRemove={onRemove} />
        </div>
    )
}