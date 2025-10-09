import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";

interface InfiniteScrollProps {
    isManual?: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

export const InfiniteScroll = ({
    isManual = false,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
}: InfiniteScrollProps) => {
    const { targetRef, isIntersecting } = useIntersectionObserver({
        threshold: 0.5,
        rootMargin: "100px",
    })

    useEffect(() => {
        if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
            fetchNextPage()
        }
    }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage, isManual])

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div ref={targetRef} className="h-1" />
            {hasNextPage ? (
                <Button
                    variant="secondary"
                    disabled={!hasNextPage || isFetchingNextPage}
                    onClick={fetchNextPage}
                >
                    {isFetchingNextPage ? <Loader2Icon className="animate-spin" /> : "Load More"}
                </Button>
            ) : (
                <h4 className="text-muted-foreground text-xs">No more videos</h4>
            )}
        </div>
    )
}
