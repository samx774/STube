import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import UserAvatar from "@/components/user-avatar"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"


export default function StudioSidebarHeader() {
    const { user } = useUser()
    const { state } = useSidebar()

    if (!user) {
        return (
            <SidebarHeader className="flex items-center justify-center pb-4">
                <Skeleton className="size-[112px] rounded-full" />
                <div className="flex flex-col items-center mt-2 gap-y-2">
                    <Skeleton className="w-[80px] h-4" />
                    <Skeleton className="w-[100px] h-4" />
                </div>
            </SidebarHeader>
        )
    }

    if (state === "collapsed") {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={"Your Profile"} asChild>
                    <Link prefetch  href={`/users/current`}>
                        <UserAvatar imageUrl={user?.imageUrl!} name={user?.fullName ?? "User"} size={"xs"} />
                        <span className="text-sm">Your profile</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <SidebarHeader className="flex items-center justify-center pb-4">
            <Link prefetch  href={"/users/current"}>
                <UserAvatar imageUrl={user?.imageUrl!} name={user?.fullName ?? "User"} className="size-[112px] hover:opacity-80 transition-opacity" />
            </Link>
            <div className="flex flex-col items-center mt-2 gap-y-1">
                <h3 className="text-sm font-semibold">Your Profile</h3>
                <h3 className="text-xs text-muted-foreground">{user?.fullName}</h3>
            </div>
        </SidebarHeader>
    )
}
