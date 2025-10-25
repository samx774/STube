import { PlaylistGetManyOutput } from "@/modules/playlists/types";
import Link from "next/link";

interface PlaylistGridCardProps {
    data: PlaylistGetManyOutput["items"][number]
}

import React from 'react'
import PlaylistThumbnail, { PlaylistThumbnailSkeleton } from "./playlist-thumbnail";
import PlaylistInfo, { PlaylistInfoSkeleton } from "./playlist-info";

export function PlaylistGridCardSkeleton() {
    return (
        <div className="flex flex-col gap-2 w0full group">
            <PlaylistThumbnailSkeleton />
            <PlaylistInfoSkeleton />
        </div>
    )
}

export default function PlaylistGridCard({
    data,
}: PlaylistGridCardProps) {
    return (
        <Link href={`/playlists/${data.id}`}>
            <div className="flex flex-col gap-2 w-full group">
                <PlaylistThumbnail
                    imageUrl={'/placeholder.svg'}
                    title={data.name}
                    videoCount={data.videoCount}
                />
                <PlaylistInfo data={data} />
            </div>
        </Link>
    )
};
