"use client"
import ResponsiveDialog from "@/components/responsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface ThumbnailUploadModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}



export default function ThumbnailUploadModal({
    videoId,
    open,
    onOpenChange,
}: ThumbnailUploadModalProps) {
    const utils = trpc.useUtils();
    const onUploadComplete = () => {
        utils.studio.getMany.invalidate();
        utils.studio.getOne.invalidate({ id: videoId });
        onOpenChange(false);
    }
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Upload Thumbnail"
        >
            <UploadDropzone
                endpoint={"thumbnailUploader"}
                input={{ videoId }}
                onClientUploadComplete={onUploadComplete}
            />
        </ResponsiveDialog>
    )
}
