

import { AlertTriangleIcon } from "lucide-react";
import { VideoGetOneOutput } from "../../types";

interface VideoBannerProps {
    status: VideoGetOneOutput["muxStatus"];
}

export default function VideoBanner({ status }: VideoBannerProps) {
    if (status === "ready") return null;

    return (
        <div className="bg-yellow-400 py-3 px-4 rounded-b-xl flex items-center gap-2">
            <AlertTriangleIcon className="size-4 text-foreground shrink-0" />
            <p className="text-xm md:text-sm font-medium line-clamp-1 text-foreground">This video is still being processed</p>
        </div>
    )
}
