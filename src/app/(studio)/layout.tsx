import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Studio",
    description: "Manage your videos",
}

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return <StudioLayout>{children}</StudioLayout>
}

export default Layout
