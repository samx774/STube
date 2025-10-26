import PlaylistHeaderSection from "../sections/playlist-header-section";
import VideosSection from "../sections/videos-srction";

interface VideosViewProps {
    playlistId: string
}

export default function VideosView({ playlistId }: VideosViewProps) {
    return (
        <div className="max-w-screen-md mx-auto mb-10 pt-2.5 flex flex-col gap-y-6">
            <PlaylistHeaderSection playlistId={playlistId} />
            <VideosSection playlistId={playlistId} />
        </div>
    )
}
