import { db } from '@/db';
import { videos } from '@/db/schema';
import { mux } from '@/lib/mux';
import { UTApi } from "uploadthing/server";
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetDeletedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const SINGING_SECRET = process.env.MUX_WEBHOOK_SECRET

type WebhookEvent =
    VideoAssetCreatedWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetDeletedWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetTrackReadyWebhookEvent

export const POST = async (req: Request) => {
    if (!SINGING_SECRET) {
        return new Response("Missing MUX Webhook Secret", { status: 500 })
    }

    const headersPayload = await headers();
    const muxSignature = headersPayload.get("mux-signature");

    if (!muxSignature) {
        return new Response("No signature found", { status: 401 })
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    mux.webhooks.verifySignature(
        body,
        {
            "mux-signature": muxSignature
        },
        SINGING_SECRET
    );

    switch (payload.type as WebhookEvent["type"]) {
        case "video.asset.created": {
            console.log(`================ ${payload.type}======================`)
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

            if (!data.upload_id) {
                return new Response("Missing upload_id", { status: 400 })
            }

            await db
                .update(videos)
                .set({
                    muxAssetId: data.id,
                    muxStatus: data.status
                })
                .where(eq(videos.muxUploadId, data.upload_id))
            break;
        }
        case "video.asset.ready": {
            console.log(`================ ${payload.type}======================`)
            const utapi = new UTApi()
            const data = payload.data as VideoAssetReadyWebhookEvent["data"];
            const playpbackId = data.playback_ids?.[0].id;

            if (!playpbackId) {
                return new Response("Missing playback_id", { status: 400 })
            }
            if (!data.upload_id) {
                return new Response("Missing upload_id", { status: 400 })
            }

            const [currentVideoState] = await db
                .select()
                .from(videos)
                .where(eq(videos.muxUploadId, data.upload_id))

            if (currentVideoState && currentVideoState.thumbnailKey && currentVideoState.previewKey) {
                await utapi.deleteFiles([currentVideoState.thumbnailKey, currentVideoState.previewKey])
            }



            const tempThumbnailUrl = `https://image.mux.com/${playpbackId}/thumbnail.png`;
            const tempPreviewUrl = `https://image.mux.com/${playpbackId}/animated.gif`;
            const duration = data.duration ? Math.round(data.duration * 1000) : 0;

            const [uploadedThumbnail, uploadedPreview] = await utapi.uploadFilesFromUrl([
                tempThumbnailUrl,
                tempPreviewUrl
            ])

            if (!uploadedThumbnail.data || !uploadedPreview.data) {
                return new Response("Failed to uploadedPreview files", { status: 500 })
            }

            const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data
            const { key: previewKey, url: previewUrl } = uploadedPreview.data
            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                    muxPlaybackId: playpbackId,
                    muxAssetId: data.id,
                    thumbnailUrl,
                    thumbnailKey,
                    previewUrl,
                    previewKey,
                    duration,
                })
                .where(eq(videos.muxUploadId, data.upload_id))
            break;
        }
        case "video.asset.errored": {
            console.log(`================ ${payload.type}======================`)
            const data = payload.data as VideoAssetErroredWebhookEvent["data"];
            if (!data.upload_id) {
                return new Response("Missing upload_id", { status: 400 })
            }
            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploadId, data.upload_id))
            break;
        }
        case "video.asset.deleted": {
            console.log(`================ ${payload.type}======================`)
            const data = payload.data as VideoAssetDeletedWebhookEvent["data"];
            const utapi = new UTApi()

            if (!data.upload_id) {
                return new Response("Missing upload_id", { status: 400 })
            }

            console.log("++++++++++++SELECTIGN VIDEO++++++++++++");
            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(eq(videos.muxUploadId, data.upload_id))

            if (!existingVideo) {
                return new Response("Video not found", { status: 404 })
            }

            if (existingVideo.thumbnailKey) {
                console.log("++++++++++++DELETING THUMBNAIL++++++++++++");

                await utapi.deleteFiles([existingVideo.thumbnailKey])
            }
            if (existingVideo.previewKey) {
                console.log("++++++++++++DELETING PREVIEW++++++++++++");
                await utapi.deleteFiles([existingVideo.previewKey])
            }

            console.log("++++++++++++DELETING FROM DB++++++++++++");
            await db
                .delete(videos)
                .where(eq(videos.muxUploadId, data.upload_id))
            break;
        }
        case "video.asset.track.ready": {
            console.log(`================ ${payload.type}======================`)
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
                asset_id: string;
            };

            const assetId = data.asset_id;
            const trackId = data.id;
            const status = data.status;
            if (!assetId) {
                return new Response("Missing upload_id", { status: 400 })
            }

            await db
                .update(videos)
                .set({
                    muxTrackId: trackId,
                    muxTrackStatus: status,
                })
                .where(eq(videos.muxAssetId, assetId))
            break;
        }
    }
    return new Response("Webhook received", { status: 200 })
}