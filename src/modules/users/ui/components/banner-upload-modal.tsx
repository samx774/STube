"use client"
import ResponsiveDialog from "@/components/responsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface BannerUploadModalProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}



export default function BannerUploadModal({
    userId,
    open,
    onOpenChange,
}: BannerUploadModalProps) {
    const utils = trpc.useUtils();
    const onUploadComplete = () => {
        utils.users.getOne.invalidate({ id: userId });
        onOpenChange(false);
    }
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Upload a banner"
        >
            <UploadDropzone
                endpoint={"bannerUploader"}
                onClientUploadComplete={onUploadComplete}
            />
        </ResponsiveDialog>
    )
}
