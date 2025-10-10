import { db } from "@/db";
import { videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policies: ['public'],
                static_renditions: [
                    {
                        resolution: "720p"
                    },
                    {
                        resolution: "480p"
                    },
                    {
                        resolution: "360p"
                    },
                ],
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: "en",
                                name: "English"
                            }
                        ]
                    }
                ],
            },
            cors_origin: "*" // set to your url in production
        })

        const [video] = await db.insert(videos).values({
            userId,
            title: "Untitled",
            muxStatus: "waiting",
            muxUploadId: upload.id,
        }).returning()

        return {
            video: video,
            url: upload.url
        }
    }),
    deleteEmpty: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        await db.delete(videos).where(and(eq(videos.userId, userId), eq(videos.muxStatus, "waiting")))
    })
})