"use client"

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";


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
        <Button className="cursor-pointer" variant={'secondary'} onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
            Create
        </Button>
    )
}
