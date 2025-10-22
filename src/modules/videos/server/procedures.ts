import { db } from "@/db";
import { subscriptions, updateVideoSchema, users, videoReactions, videos, videoViews } from "@/db/schema";
import { mux } from "@/lib/mux";
import { workflow } from "@/lib/workflow";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, inArray, isNotNull, lt, or } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
export const videosRouter = createTRPCRouter({
    getMany: baseProcedure.input(z.object({
        categoryId: z.uuid().nullish(),
        cursor: z.object({
            id: z.uuid(),
            updatedAt: z.date()
        })
            .nullish(),
        limit: z.number().min(1).max(100),
    })).query(async ({ input }) => {
        const { cursor, limit, categoryId } = input;

        const data = await db
            .select({
                ...getTableColumns(videos),
                user: users,
                viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
                likeCount: db.$count(videoReactions, and(
                    eq(videoReactions.videoId, videos.id),
                    eq(videoReactions.type, 'like'),
                )),
                dislikeCount: db.$count(videoReactions, and(
                    eq(videoReactions.videoId, videos.id),
                    eq(videoReactions.type, 'dislike'),
                )),


            })
            .from(videos)
            .innerJoin(users, eq(videos.userId, users.id))
            .where(and(
                eq(videos.visibility, "public"),
                categoryId ? eq(videos.categoryId, categoryId) : undefined,
                cursor
                    ? or(
                        lt(videos.updatedAt, cursor.updatedAt),
                        and(
                            eq(videos.updatedAt, cursor.updatedAt),
                            lt(videos.id, cursor.id)
                        )
                    )
                    : undefined
            )).orderBy(desc(videos.updatedAt), desc(videos.id))
            .limit(limit + 1)

        const hasMore = data.length > limit;
        const items = hasMore ? data.slice(0, -1) : data;
        const lastItem = items[items.length - 1]
        const nextCursor = hasMore ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt
        } : null;

        return {
            items,
            nextCursor
        }
    }),
    getOne: baseProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const { clerkUserId } = ctx;

        let userId;

        const [user] = await db
            .select()
            .from(users)
            .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

        if (user) {
            userId = user.id;
        }

        const viewerReactions = db.$with("viewer_reactions").as(
            db
                .select({
                    videoId: videoReactions.videoId,
                    type: videoReactions.type,
                })
                .from(videoReactions)
                .where(inArray(videoReactions.userId, userId ? [userId] : []))
        );

        const viewerSubscriptions = db.$with("viewer_subscriptions").as(
            db
                .select()
                .from(subscriptions)
                .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
        );

        const [existingVideo] = await db
            .with(viewerReactions, viewerSubscriptions)
            .select({
                ...getTableColumns(videos),
                user: {
                    ...getTableColumns(users),
                    subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
                    viewerSubscribed: isNotNull(viewerSubscriptions.creatorId).mapWith(Boolean),
                },
                viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
                likeCount: db.$count(videoReactions, and(
                    eq(videoReactions.videoId, videos.id),
                    eq(videoReactions.type, "like")
                )),
                dislikeCount: db.$count(videoReactions, and(
                    eq(videoReactions.videoId, videos.id),
                    eq(videoReactions.type, "dislike")
                )),
                viewerReaction: viewerReactions.type
            })
            .from(videos)
            .innerJoin(users, eq(videos.userId, users.id))
            .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
            .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
            .where(eq(videos.id, input.id))

        if (!existingVideo) throw new TRPCError({ code: "NOT_FOUND" })

        return existingVideo
    }),
    generateTitle: protectedProcedure.input(z.object({ id: z.uuid(), prompt: z.string().min(10) })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user
        const { workflowRunId } = await workflow.trigger({
            url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
            body: { userId, videoId: input.id, prompt: input.prompt },
            retries: 3,
        })

        return workflowRunId;
    }),
    revalidate: protectedProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
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

        if (!existingVideo.muxUploadId) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Video Upload ID Not Found" })
        }

        const directUpload = await mux.video.uploads.retrieve(existingVideo.muxUploadId);

        if (!directUpload || !directUpload.asset_id) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Video Upload Not Found" })
        }

        const asset = await mux.video.assets.retrieve(
            directUpload.asset_id
        )

        if (!asset) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Video Asset Not Found" })
        }

        const [updatedVideo] = await db
            .update(videos)
            .set({
                muxStatus: asset.status,
                muxPlaybackId: asset.playback_ids?.[0].id,
                muxAssetId: asset.id,
                duration: asset.duration ? Math.round(asset.duration * 1000) : 0,
            })
            .where(and(
                eq(videos.id, input.id),
                eq(videos.userId, userId)
            ))
            .returning();

        return updatedVideo;
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