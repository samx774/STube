import { Suspense } from "react";
import FormSection from "../sections/form-section";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

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
    return (
        <div className="px-4 pt-2.5 max-w-screen">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-3 w-60" />
                </div>
                <div className="flex items-center gap-x-2">
                    <Skeleton className="h-9 w-16 rounded-md" /> 
                    <Skeleton className="h-9 w-9 rounded-md" /> 
                </div>
            </div>
            <div className="grid mb-6 grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="space-y-8 lg:col-span-3">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-40 w-full" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-[84px] w-[153px]" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
               
                <div className="flex flex-col gap-y-8 lg:col-span-2">
                        <div className="aspect-video relative">
                            <Skeleton className="absolute inset-0 h-full w-full" />
                        </div>
                        <div className="p-4 flex flex-col gap-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}


function VideoViewSuspense({ videoId }: VideoViewProps) {
    return (
        <div className="px-4 pt-2.5 max-w-screen">
            <FormSection videoId={videoId} />
        </div>
    )
}
