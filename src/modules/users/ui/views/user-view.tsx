import { Separator } from "@/components/ui/separator"
import { UserSection } from "../sections/user-section"
import VideosSection from "../sections/videos-section"

interface UserViewProps {
    userId: string
}

export function UserView({ userId }: UserViewProps) {
    return (
        <div className="flex flex-col max-w-[1300px] pt-2.5 mx-auto mb-10 gap-y-6">
            <UserSection userId={userId} />
            <div className="px-4">
                <Separator />
            </div>
            <VideosSection userId={userId} />
        </div>
    )
}
