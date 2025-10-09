import { Webhooks } from './../../../../../node_modules/@mux/mux-node/src/resources/webhooks';
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetDeletedWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks"
import { mux } from '@/lib/mux';
import { db } from '@/db';
import { videos } from '@/db/schema';

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
    }
    return new Response("Webhook received", { status: 200 })
}