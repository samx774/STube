import { db } from "@/db";
import { updateVideoSchema, videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { workflow } from "@/lib/workflow";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
export const videosRouter = createTRPCRouter({
    generateTitle: protectedProcedure.input(z.object({ id: z.uuid(), prompt: z.string().min(10) })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user
        const { workflowRunId } = await workflow.trigger({
            url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
            body: { userId, videoId: input.id, prompt: input.prompt },
            retries: 3,
        })

        return workflowRunId;
    }),
    restoreThumbnail: protectedProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;

        const [existingVideo] = await db
            .select()
            .from(videos)
            .where(and(
                eq(videos.id, input.id),
                eq(videos.userId, userId)
            ))

        if (!existingVideo) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Video Not Found" })
        }

        if (existingVideo.thumbnailKey) {
            const utapi = new UTApi()
            await utapi.deleteFiles(existingVideo.thumbnailKey)
            await db
                .update(videos)
                .set({
                    thumbnailUrl: null,
                    thumbnailKey: null,
                    updatedAt: new Date(),
                })
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
        }


        if (!existingVideo.muxPlaybackId) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Playback ID Not Found" })
        }

        const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.png`;

        const utapi = new UTApi()
        const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl)

        if (!uploadedThumbnail.data) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to upload thumbnail" })
        }

        const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data

        const [updatedVideo] = await db
            .update(videos)
            .set({
                thumbnailUrl,
                thumbnailKey,
                updatedAt: new Date()
            })
            .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
            .returning()

        if (!updatedVideo) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Video Not Found" })
        }
        return updatedVideo;
    }),
    delete: protectedProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;
        const utapi = new UTApi()
        if (!input.id) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Video ID is required" })
        }

        const [existingVideo] = await db
            .select()
            .from(videos)
            .where(and(
                eq(videos.id, input.id),
                eq(videos.userId, userId)
            ))


        if (!existingVideo) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Video Not Found" })
        }
        if (!existingVideo.muxAssetId) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Video Asset ID Not Found" })
        }

        if (existingVideo.thumbnailKey) {
            console.log("++++++++++++DELETING THUMBNAIL++++++++++++");

            await utapi.deleteFiles([existingVideo.thumbnailKey])
        }
        if (existingVideo.previewKey) {
            console.log("++++++++++++DELETING PREVIEW++++++++++++");
            await utapi.deleteFiles([existingVideo.previewKey])
        }

        const [deletedVideo] = await db.delete(videos).where(and(eq(videos.id, input.id), eq(videos.userId, userId))).returning()
        await mux.video.assets.delete(existingVideo.muxAssetId)


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