import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

interface SubscriptionButtonProps {
    className?: string;
    onClick: () => void;
    disabled: boolean;
    isSubscribed: boolean;
    size?: VariantProps<typeof buttonVariants>["size"]
}

export default function SubscriptionButton({ className, onClick, disabled, isSubscribed, size }: SubscriptionButtonProps) {
    return (
        <Button
            size={size}
            disabled={disabled}
            onClick={onClick}
            variant={isSubscribed ? "secondary" : "default"}
            className={cn("rounded-full", className)}
        >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
    )
}
