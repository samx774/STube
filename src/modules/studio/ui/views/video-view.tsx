import { Suspense } from "react";
import FormSection from "../sections/form-section";
import { ErrorBoundary } from "react-error-boundary";

interface VideoViewProps {
    videoId: string;
}

export function VideoView({ videoId }: VideoViewProps) {
    return (
        <Suspense fallback={<FormSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <VideoViewSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function FormSectionSkeleton() {
    return <p>Loading...</p>
}

function VideoViewSuspense({ videoId }: VideoViewProps) {
    return (
        <div className="px-4 pt-2.5 max-w-screen">
            <FormSection videoId={videoId} />
        </div>
    )
}
