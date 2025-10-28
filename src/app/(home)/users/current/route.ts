import { db } from "@/db"
import { users } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"


export const GET = async () => {
    const { userId } = await auth()

    if (!userId) return redirect('/sign-in')

    const [exsitingUser] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId))

    if (!exsitingUser) return redirect('/sign-in')

    return redirect(`/users/${exsitingUser.id}`)
}


