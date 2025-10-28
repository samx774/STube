"use client"

import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { UserPageBanner, UserPageBannerSkeleton } from "../components/user-page-banner"
import { UserPageInfo, UserPageInfoSkeleton } from "../components/user-page-info"

interface UserSectionProps {
    userId: string
}

export function UserSection(props: UserSectionProps) {
    return (
        <Suspense fallback={<UserSectionSkeleton />}>
            <ErrorBoundary fallback={<div>error</div>}>
                <UserSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}


function UserSectionSkeleton() {
    return (
        <div className="flex flex-col px-4">
            <UserPageBannerSkeleton />
            <UserPageInfoSkeleton />
        </div>
    )
}

function UserSectionSuspense({ userId }: UserSectionProps) {
    const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId })
    return (
        <div className="flex flex-col px-4">
            <UserPageBanner user={user} />
            <UserPageInfo user={user} />
        </div>
    )
}
