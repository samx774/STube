import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/user-avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from 'zod'
import { trpc } from "@/trpc/client";
import { commentInsertSchema } from "@/db/schema";
import { Form, FormControl, FormItem, FormField, FormMessage } from "@/components/ui/form"

interface CommentFormProps {
    videoId: string;
    onSuccess?: () => void
}

export const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
    const { user } = useUser()
    const clerk = useClerk()
    const utils = trpc.useUtils();
    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId });
            form.reset();
            toast.success("Comment added successfully");
            onSuccess?.();
        },
        onError: (error) => {
            toast.error("Failed to add comment");
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })

    const formSchema = commentInsertSchema.omit({ userId: true })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoId,
            value: ''
        },
    })

    function handleSubmit(values: z.infer<typeof formSchema>) {
        create.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-4 group">
                <UserAvatar
                    size={'lg'}
                    imageUrl={user?.imageUrl || '/user-placeholder.svg'}
                    name={user?.username || 'User'}
                />
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Add a comment..."
                                        className="resize-none bg-transparent overflow-hidden"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="justify-end gap-2 mt-2 flex">
                        <Button
                            disabled={create.isPending}
                            type="submit"
                            size={'sm'}
                        >
                            Comment
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}