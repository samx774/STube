import React from 'react'
import { VideoGetOneOutput } from '../../types';
import Link from 'next/link';
import UserAvatar from '@/components/user-avatar';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import SubscriptionButton from '@/modules/subscriptions/ui/components/subscription-button';
import UserInfo from '@/modules/users/ui/components/user-info';
import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription';

interface VideoOwnerProps {
    user: VideoGetOneOutput["user"];
    videoId: string;
}

export default function VideoOwner({ user, videoId }: VideoOwnerProps) {
    const { userId, isLoaded } = useAuth()
    const { onClick, isPending } = useSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
        fromVideoId: videoId,
    })
    
    return (
        <div className='flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0'>
            <Link href={`/users/${user.id}`}>
                <div className='flex items-center gap-3 min-w-0'>
                    <UserAvatar size={'lg'} name={user.name} imageUrl={user.imageUrl} />
                    <div className='flex flex-col gap-1 min-w-0'>
                        <UserInfo name={user.name} size="lg" />
                        <span className='text-sm text-muted-foreground'>
                            {user.subscriberCount} subscribers
                        </span>
                    </div>
                </div>
            </Link>
            {userId === user.clerkId ? (
                <Button className='rounded-full'
                    variant={"secondary"}
                    asChild>
                    <Link href={`/studio/videos/${videoId}`}>
                        Edit video
                    </Link>
                </Button>
            ) : (
                <SubscriptionButton
                    onClick={onClick}
                    disabled={isPending || !isLoaded}
                    isSubscribed={user.viewerSubscribed}
                    className="flex-none" />
            )}
        </div>
    )
}
