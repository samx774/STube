import { SidebarTrigger } from "@/components/ui/sidebar"
import AuthButton from "@/modules/auth/ui/components/auth-button"
import Image from "next/image"
import Link from "next/link"
import StudioUploadModal from "../studio-upload-modal"

export const StudioNavbar = () => {
    return (
        <nav className="fixed top-0 w-full h-16 bg-background flex items-center px-2 pr-5 z-50 border-b shadow-md">
            <div className="flex items-center gap-4 w-full justify-between">
                <div className="flex items-center shrink-0">
                    <SidebarTrigger />
                    <Link prefetch  href="/studio" className="hidden md:block">
                        <div className="p-4 flex items-center gap-1">
                            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                            <h3 className="text-xl font-bold tracking-tight">Studio</h3>
                        </div>
                    </Link>
                </div>
                <div className="shrink-0 flex items-center gap-4">
                    <StudioUploadModal />
                    <AuthButton />
                </div>
            </div>
        </nav>
    )
}