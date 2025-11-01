import { DEFAULT_LIMIT } from "@/constants";
import VideoView from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { videoId } = await params;

  const video = await trpc.videos.getOne({ id: videoId });

  if (!video) {
    return {
      title: "Video not found",
      description: "This video does not exist.",
    };
  }

  return {
    title: video.title,
    description: video.description ?? "Watch amazing videos on STube.",
    openGraph: {
      title: video.title,
      description: video.description ?? "Watch amazing videos on STube.",
      images: [
        {
          url: video.thumbnailUrl ?? "/placeholder.jpg",
          width: 1280,
          height: 720,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description ?? "Watch amazing videos on STube.",
      images: [video.thumbnailUrl ?? "/default-thumbnail.jpg"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { videoId } = await params;

  void trpc.videos.getOne.prefetch({ id: videoId });
  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
