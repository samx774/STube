"use client"
import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SparklesIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from 'zod';
interface PlaylistCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    name: z.string().min(1)
})

export default function PlaylistCreateModal({
    open,
    onOpenChange,
}: PlaylistCreateModalProps) {
    const utils = trpc.useUtils()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    });

    const create = trpc.playlists.create.useMutation({
        onSuccess: () => {
            utils.playlists.getMany.invalidate()
            form.reset()
            onOpenChange(false)
            toast.success("Playlist created")
        },
        onError: () => {
            toast.error("Failed to create");
        }

    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        create.mutate(values)
    }
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title={"Create a new playlist"}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={create.isPending}
                                        {...field}
                                        placeholder="My favorite videos..."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={create.isPending}
                            type="submit"
                            className={`${create.isPending && 'opacity-50'}`}
                        >
                            {create.isPending ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>

        </ResponsiveDialog>
    )
}
