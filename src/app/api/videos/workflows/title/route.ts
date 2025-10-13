import { db } from '@/db';
import { videos } from '@/db/schema';
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from 'drizzle-orm';
import { GoogleGenAI } from "@google/genai";

interface InputType {
    userId: string;
    videoId: string;
    prompt: string;
}

const ai = new GoogleGenAI({});

const TITLE_SYSTEM_PROMPT = `Your task is to take an input and based on it generate an SEO-focused title for a YouTube video. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.

and the Input is: `;

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to take an input and based on it generate an SEO-focused Descrition for a YouTube video. Please follow these guidelines:
- Create a short, engaging description based only on the given keywords or phrases.
- Keep it clear, catchy, and relevant to the topic.
- Avoid filler words, complex language, or unnecessary details.
- Focus on attracting viewers and summarizing what the video offers.
- Limit the description to 3–5 sentences and under 200 characters.

and the input is: `;

export const { POST } = serve(
    async (context) => {
        const input = context.requestPayload as InputType;
        const { videoId, userId, prompt } = input;

        const video = await context.run("get-video", async () => {
            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(and(
                    eq(videos.id, videoId),
                    eq(videos.userId, userId)
                ));

            if (!existingVideo) {
                throw new Error("Not found")
            }

            return existingVideo
        })


        const generatedTitle = await context.run("generate-title", async () => {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: `${TITLE_SYSTEM_PROMPT} ${prompt}`,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 0
                    }
                }
            });

            return response.text
        })
        const generatedDescription = await context.run("generate-description", async () => {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: `${DESCRIPTION_SYSTEM_PROMPT} ${prompt}`,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 0
                    }
                }
            });

            return response.text
        })

        if (!generatedTitle) throw new Error('Bad request')

        await context.run("update-step", async () => {


            await db
                .update(videos)
                .set({
                    title: generatedTitle || video.title,
                    description: generatedDescription || video.description
                })
                .where(and(
                    eq(videos.id, video.id),
                    eq(videos.userId, video.userId)
                ))
        })
    }
)