"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { FunctionComponent } from "react";
import { usePathname } from "next/navigation";

interface Item {
    title: string;
    href: string;
    icon: FunctionComponent;
    auth?: boolean;
}

const items: Item[] = [
    {
        title: "History",
        href: "/playlists/history",
        icon: HistoryIcon,
        auth: true
    },
    {
        title: "Liked videos",
        href: "/playlists/liked",
        icon: ThumbsUpIcon,
        auth: true
    },
    {
        title: "All playlists",
        href: "/playlists",
        icon: ListVideoIcon,
        auth: true
    },

]

export const PersonalSection = () => {
    const clerk = useClerk()
    const { isSignedIn } = useAuth()
    const pathname = usePathname()

    const checkSignIn = (item: Item, e: React.MouseEvent) => {
        if (!isSignedIn && item.auth) {
            e.preventDefault()
            return clerk.openSignIn()
        }
    }
    return (
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title} asChild isActive={pathname === item.href} onClick={(e) => checkSignIn(item, e)}>
                                <Link href={item.href} className="flex items-center gap-4">
                                    <item.icon />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}