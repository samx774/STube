import { db } from "@/db";
import { updateVideoSchema, videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
export const videosRouter = createTRPCRouter({
    delete: protectedProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;
        if (!input.id) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Video ID is required" })
        }

        const [deletedVideo] = await db.delete(videos).where(and(eq(videos.id, input.id), eq(videos.userId, userId))).returning()

        if (!deletedVideo) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Video Not Found" })
        }
        return deletedVideo;
    }),
    update: protectedProcedure.input(updateVideoSchema).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;

        if (!input.id) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Video ID is required" })
        }

        const [updatedVideo] = await db.update(videos).set({
            title: input.title,
            description: input.description,
            categoryId: input.categoryId,
            visibility: input.visibility,
            updatedAt: new Date()
        }).where(and(eq(videos.id, input.id), eq(videos.userId, userId))).returning()

        if (!updatedVideo) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Video Not Found" })
        }
        return updatedVideo;
    }),
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