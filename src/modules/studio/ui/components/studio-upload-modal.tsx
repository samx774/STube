"use client"

import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import StudioUploader from "./studio-uploader";
import { useRouter } from "next/navigation";

export default function StudioUploadModal() {
    const router = useRouter();
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        onSuccess: () => {
            // toast.success("Video created successfully");
            utils.studio.getMany.invalidate();
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });
    const deleteEmpty = trpc.videos.deleteEmpty.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    })
    function onClose() {
        create.reset();
        deleteEmpty.mutate();
    }
    const onSuccess = () => {
        if (!create.data?.video.id) return;
        create.reset();
        toast.success("Video uploaded successfully");
        utils.studio.getMany.invalidate();
        deleteEmpty.reset();
        router.push(`/studio/videos/${create.data.video.id}`);
    }
    return (
        <>
            <ResponsiveDialog
                title="Upload a video"
                open={!!create.data?.url}
                onOpenChange={onClose}
            >
                {create.data ?
                    <StudioUploader endpoint={create.data?.url} onSuccess={onSuccess} />
                    : <Loader2Icon className="animate-spin" />
                }
            </ResponsiveDialog>
            <Button className="cursor-pointer" variant={'secondary'} onClick={() => create.mutate()} disabled={create.isPending}>
                {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                Create
            </Button>
        </>
    )
}
