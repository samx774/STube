"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateVideoSchema } from "@/db/schema";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyCheckIcon, CopyIcon, Globe2Icon, LockIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from 'zod';
import { useRouter } from "next/navigation";

interface FormSectionProps {
    videoId: string;
}

export default function FormSection({ videoId }: FormSectionProps) {
    const router = useRouter();
    const [isCopied, setIsCopied] = useState(false);
    const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });

    const [categories] = trpc.categories.getMany.useSuspenseQuery();
    const utils = trpc.useUtils();
    const update = trpc.videos.update.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate({ id: videoId });
            toast.success("Video updated successfully");
        },
        onError: () => {
            toast.error("Failed to update video");
        }

    });
    const remove = trpc.videos.delete.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            toast.success("Video deleted successfully");
            router.push("/studio");
            // utils.studio.getOne.invalidate({ id: videoId });
        },
        onError: () => {
            toast.error("Failed to delete video");
        }

    });

    const form = useForm<z.infer<typeof updateVideoSchema>>({
        resolver: zodResolver(updateVideoSchema),
        defaultValues: video,
    });

    const onSubmit = (data: z.infer<typeof updateVideoSchema>) => {
        update.mutateAsync(data);
    }

    const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${video.id}`;

    const onCopy = async () => {
        await navigator.clipboard.writeText(fullUrl);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Video Details</h1>
                        <p className="text-muted-foreground text-sm">Manage your video details</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button className="cursor-pointer" type="submit" disabled={update.isPending}>
                            Save
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="cursor-pointer" variant={"ghost"} size={'icon'}>
                                    <MoreVerticalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => remove.mutateAsync({ id: videoId })}>
                                    <TrashIcon className="size-4 me-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="space-y-8 lg:col-span-3">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            placeholder="Add a title to your video" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            rows={10}
                                            className="resize-none pe-10"
                                            placeholder="Add a title to your video" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Category
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ?? undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(cat =>
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-y-8 lg:col-span-2">
                        <div className="flex flex-col gap-4 bg-muted rounded-xl overflow-hidden h-fit">
                            <div className="aspect-video overflow-hidden relative">
                                <VideoPlayer
                                    playbackId={video.muxPlaybackId}
                                    thumbnailUrl={video.thumbnailUrl}
                                />
                            </div>
                            <div className="p-4 flex flex-col gap-y-6">
                                <div className="flex justify-between items-center gap-x-2">
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Video link
                                        </p>
                                        <div className="flex items-center gap-x-2">
                                            <Link href={`/videos/${video.id}`}>
                                                <p className="line-clamp-1 text-sm text-blue-500">
                                                    {fullUrl}
                                                </p>
                                            </Link>
                                            <Button type="button" variant={'ghost'} size={'icon'} className="shrink-0 cursor-pointer"
                                                onClick={onCopy}
                                                disabled={isCopied}
                                            >
                                                {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Video Status
                                        </p>
                                        <p className="text-sm capitalize">
                                            {video.muxStatus || "preparing"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Subtitles Status
                                        </p>
                                        <p className="text-sm capitalize">
                                            {video.muxTrackStatus || "No Subtitles"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Visibility
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ?? undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="public">
                                                <Globe2Icon className="me-2 size-4" />
                                                Public
                                            </SelectItem>
                                            <SelectItem value="private">
                                                <LockIcon className="me-2 size-4" />
                                                Private
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </form>
        </Form>
    )
}
