import { ModeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import AuthButton from "@/modules/auth/ui/components/auth-button"
import Image from "next/image"
import Link from "next/link"
import VoiceSearchModal from "../voice-search-modal"
import { SearchInput } from "./search-input"

export const HomeNavbar = () => {
    return (
        <nav className="fixed top-0 w-full h-16 bg-background flex items-center px-2 pr-5 z-50">
            <div className="flex items-center gap-4 w-full">
                <div className="flex items-center shrink-0">
                    <SidebarTrigger />
                    <Link prefetch href="/" className="hidden md:block">
                        <div className="p-4 flex items-center gap-1">
                            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                            <h3 className="text-xl font-bold tracking-tight">STube</h3>
                        </div>
                    </Link>
                </div>
                <div className="flex-1 flex justify-center items-center gap-x-3 max-w-[720px] mx-auto">
                    <SearchInput />
                    <VoiceSearchModal />
                </div>
                <div className="shrink-0 flex items-center gap-4">
                    <ModeToggle />
                    <AuthButton />
                </div>
            </div>
        </nav>
    )
}