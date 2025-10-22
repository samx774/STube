import { CommentsSection } from "../secions/comments-section"
import SuggestionsSection from "../secions/suggestions-section"
import VideoSection from "../secions/video-section"

interface VideoViewProps {
    videoId: string
}

export default function VideoView({ videoId }: VideoViewProps) {
    return (
        <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 md:px-4 mb-10">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0">
                    <VideoSection videoId={videoId} />
                    <div className="lg:hidden pt-2.5 sm:px-4 block mt-4">
                        <SuggestionsSection videoId={videoId} isManual />
                    </div>
                    <CommentsSection videoId={videoId} />
                </div>
                <div className="hidden lg:block w-full lg:w-[380px] xl:w-[460px] shrink-1">
                    <SuggestionsSection videoId={videoId} />
                </div>
            </div>
        </div>
    )
}
