import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { Loader2Icon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";
interface VideoReactionsProps {
    videoId: string;
    likeCount: number;
    dislikeCount: number;
    viewerReaction: "like" | "dislike" | null;
}

export default function VideoReactions({
    videoId,
    likeCount,
    dislikeCount,
    viewerReaction
}: VideoReactionsProps) {
    const clerk = useClerk();
    const utils = trpc.useUtils()
    const like = trpc.videoReactions.like.useMutation({
        onSuccess: () => {
            utils.videos.getOne.invalidate({ id: videoId })
        },
        onError: (error) => {
            toast.error("Something went wrong")
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.signOut()
            }
        }
    })
    const dislike = trpc.videoReactions.dislike.useMutation({
        onSuccess: () => {
            utils.videos.getOne.invalidate({ id: videoId })
        },
        onError: (error) => {
            toast.error("Something went wrong")
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.signOut()
            }
        }
    })

    const handleLike = () => {
        like.mutate({ videoId })
    }

    const handleDislike = () => {
        dislike.mutate({ videoId })
    }

    return (
        <div className="flex items-center flex-none">
            <Button
                onClick={handleLike}
                disabled={like.isPending || dislike.isPending}
                variant={'secondary'}
                className="rounded-l-full hover:bg-accent/50 rounded-r-none pr-4"
            >
                {like.isPending? <Loader2Icon className="size-5 animate-spin" /> : <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-foreground")} />}
                {likeCount}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button
                onClick={handleDislike}
                disabled={like.isPending || dislike.isPending}
                variant={'secondary'}
                className="rounded-l-none hover:bg-accent/50 rounded-r-full pl-4"
            >
                {dislike.isPending? <Loader2Icon className="size-5 animate-spin" /> : <ThumbsDownIcon className={cn("size-5", viewerReaction === "dislike" && "fill-foreground")} />}
                {dislikeCount}
            </Button>
        </div>
    )
}
