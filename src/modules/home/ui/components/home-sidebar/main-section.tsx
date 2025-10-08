"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth, useClerk } from "@clerk/nextjs";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";
import { FunctionComponent } from "react";

interface Item {
    title: string;
    href: string;
    icon: FunctionComponent;
    auth?: boolean;
}

const items: Item[] = [
    {
        title: "Home",
        href: "/",
        icon: HomeIcon
    },
    {
        title: "Subscriptions",
        href: "/feed/subscriptions",
        icon: PlaySquareIcon,
        auth: true
    },
    {
        title: "Trending",
        href: "/feed/trending",
        icon: FlameIcon,
    },

]

export const MainSection = () => {
    const clerk = useClerk()
    const { isSignedIn } = useAuth()

    const checkSignIn = (item: Item, e: React.MouseEvent) => {
        if (!isSignedIn && item.auth) {
            e.preventDefault()
            return clerk.openSignIn()
        }
    }
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title} asChild isActive={false} onClick={(e) => checkSignIn(item, e)}>
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