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
  viewerReaction,
}: VideoReactionsProps) {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onMutate: async ({ videoId }) => {
      await utils.videos.getOne.cancel({ id: videoId });
      const previous = utils.videos.getOne.getData({ id: videoId });

      utils.videos.getOne.setData({ id: videoId }, (old) => {
        if (!old) return old;

        let newLikeCount = old.likeCount;
        let newDislikeCount = old.dislikeCount;
        let newViewerReaction: "like" | "dislike" | null = "like";

        if (old.viewerReaction === "like") {
          newLikeCount--;
          newViewerReaction = null;
        } else if (old.viewerReaction === "dislike") {
          newLikeCount++;
          newDislikeCount--;
        } else {
          newLikeCount++;
        }

        return {
          ...old,
          likeCount: newLikeCount,
          dislikeCount: newDislikeCount,
          viewerReaction: newViewerReaction,
        };
      });

      return { previous };
    },
    onError: (err, _, context) => {
      toast.error("Something went wrong");
      if (err.data?.code === "UNAUTHORIZED") clerk.openSignIn();
      if (context?.previous)
        utils.videos.getOne.setData({ id: videoId }, context.previous);
    },
    onSettled: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate()
    },
  });

  const dislike = trpc.videoReactions.dislike.useMutation({
    onMutate: async ({ videoId }) => {
      await utils.videos.getOne.cancel({ id: videoId });
      const previous = utils.videos.getOne.getData({ id: videoId });

      utils.videos.getOne.setData({ id: videoId }, (old) => {
        if (!old) return old;

        let newLikeCount = old.likeCount;
        let newDislikeCount = old.dislikeCount;
        let newViewerReaction: "like" | "dislike" | null = "dislike";

        if (old.viewerReaction === "dislike") {
          newDislikeCount--;
          newViewerReaction = null;
        } else if (old.viewerReaction === "like") {
          newLikeCount--;
          newDislikeCount++;
        } else {
          newDislikeCount++;
        }

        return {
          ...old,
          likeCount: newLikeCount,
          dislikeCount: newDislikeCount,
          viewerReaction: newViewerReaction,
        };
      });

      return { previous };
    },
    onError: (err, _, context) => {
      toast.error("Something went wrong");
      if (err.data?.code === "UNAUTHORIZED") clerk.openSignIn();
      if (context?.previous)
        utils.videos.getOne.setData({ id: videoId }, context.previous);
    },
    onSettled: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
  });

  const handleLike = () => like.mutate({ videoId });
  const handleDislike = () => dislike.mutate({ videoId });

  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={handleLike}
        disabled={like.isPending || dislike.isPending}
        variant={"secondary"}
        className="rounded-l-full disabled:opacity-100 hover:bg-accent/50 rounded-r-none pr-4"
      >
          <ThumbsUpIcon
            className={cn(
              "size-5",
              viewerReaction === "like" && "fill-foreground"
            )}
          />
        {likeCount}
      </Button>

      <Separator orientation="vertical" className="h-7" />

      <Button
        onClick={handleDislike}
        disabled={like.isPending || dislike.isPending}
        variant={"secondary"}
        className="rounded-l-none disabled:opacity-100 hover:bg-accent/50 rounded-r-full pl-4"
      >
          <ThumbsDownIcon
            className={cn(
              "size-5",
              viewerReaction === "dislike" && "fill-foreground"
            )}
          />
        {dislikeCount}
      </Button>
    </div>
  );
}
