'use client'

import { InfiniteScroll } from "@/components/infinite-scroll"
import { DEFAULT_LIMIT } from "@/constants"
import { CommentForm } from "@/modules/comments/ui/components/comment-form"
import { CommentItem } from "@/modules/comments/ui/components/comment-item"
import { trpc } from "@/trpc/client"
import { Loader2Icon } from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface CommentsSectionProps {
    videoId: string
}

export function CommentsSection({ videoId }: CommentsSectionProps) {
    return (
        <Suspense fallback={<CommentSectionSkeleton />}>
            <ErrorBoundary fallback={<p>error</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const CommentSectionSkeleton = () => {
    return (
        <div className="mt-6 flex justify-center items-center">
            <Loader2Icon className="animate-spin text-muted-foreground size-7" />
        </div>
    )
}

function CommentsSectionSuspense({ videoId }: CommentsSectionProps) {
    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery({ videoId, limit: DEFAULT_LIMIT },
        { getNextPageParam: (lastPage) => lastPage.nextCursor, })
    return (
        <div className="my-6">
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">{comments.pages[0].totalCount} Comments</h2>
                <CommentForm videoId={videoId} />
                <div className="flex flex-col gap-4 mt-2">
                    {comments.pages.flatMap(page => page.items).map((comment) => (
                        <CommentItem
                            videoId={videoId}
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
                    <InfiniteScroll
                        word="comments"
                        hasNextPage={query.hasNextPage}
                        isFetchingNextPage={query.isFetchNextPageError}
                        fetchNextPage={query.fetchNextPage}
                    />
                </div>
            </div>
        </div>
    )
}