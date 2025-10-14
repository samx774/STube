import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export default function VideoReactions() {
    const viewerReaction: "like" | "dislike" | null = null;

    return (
        <div className="flex items-center flex-none">
            <Button
                variant={'secondary'}
                className="rounded-l-full rounded-r-none pr-4"
            >
                <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-foreground")} />
                1
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button
                variant={'secondary'}
                className="rounded-l-none rounded-r-full pl-4"
            >
                <ThumbsDownIcon className={cn("size-5", viewerReaction === "dislike" && "fill-foreground")} />
                1
            </Button>
        </div>
    )
}
