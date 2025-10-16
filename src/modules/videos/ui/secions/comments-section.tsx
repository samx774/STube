'use client'

import { CommentForm } from "@/modules/comments/ui/components/comment-form"
import { CommentItem } from "@/modules/comments/ui/components/comment-item"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface CommentsSectionProps {
    videoId: string
}

export function CommentsSection({ videoId }: CommentsSectionProps) {
    return (
        <Suspense fallback={<p>loading</p>}>
            <ErrorBoundary fallback={<p>error</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function CommentsSectionSuspense({ videoId }: CommentsSectionProps) {
    const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId })
    return (
        <div className="my-6">
            <div className="flex flex-col gap-6">
                <h2>0 Comments</h2>
                <CommentForm videoId={videoId} />
                <div className="flex flex-col gap-4 mt-2">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}