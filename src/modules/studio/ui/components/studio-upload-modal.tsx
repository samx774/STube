"use client"

import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import StudioUploader from "./studio-uploader";


export default function StudioUploadModal() {
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        onSuccess: () => {
            toast.success("Video created successfully");
            utils.studio.getMany.invalidate();
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });
    return (
        <>
            <ResponsiveDialog
                title="Upload a video"
                open={!!create.data}
                onOpenChange={()=> create.reset()}
            >
                <StudioUploader />
            </ResponsiveDialog>
            <Button className="cursor-pointer" variant={'secondary'} onClick={() => create.mutate()} disabled={create.isPending}>
                {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                Create
            </Button>
        </>
    )
}
