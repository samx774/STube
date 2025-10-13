"use client"
import ResponsiveDialog from "@/components/responsive-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { UploadDropzone } from "@/lib/uploadthing";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { z } from 'zod'
import { SparklesIcon } from "lucide-react";
interface GenerateTitleModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    prompt: z.string().min(10)
})

export default function GenerateTitleModal({
    videoId,
    open,
    onOpenChange,
}: GenerateTitleModalProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ''
        }
    });

    const generateTitle = trpc.videos.generateTitle.useMutation({
        onSuccess: () => {
            toast.success("AI generation is now started...this may take some time you can check in a few seconds")
            form.reset()
            onOpenChange(false)
        },
        onError: () => {
            toast.error("Failed to generate");
        }

    });

    // const utils = trpc.useUtils();

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        generateTitle.mutate({ id: videoId, prompt: values.prompt })
        // utils.studio.getMany.invalidate();
        // utils.studio.getOne.invalidate({ id: videoId });
        // onOpenChange(false);
    }
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={<div className="flex items-center justify-center gap-x-2">
                Generate Title & Description With AI <SparklesIcon />
            </div>}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        disabled={generateTitle.isPending}
                                        {...field}
                                        className="resize-none min-h-23 max-h-25"
                                        placeholder="Describe your video with a few words"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={generateTitle.isPending}
                            type="submit"
                            className={`${generateTitle.isPending && 'opacity-50'}`}
                        >
                            {generateTitle.isPending ? "Generating..." : "Generate"}
                        </Button>
                    </div>
                </form>
            </Form>

        </ResponsiveDialog>
    )
}
