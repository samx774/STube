"use client"
import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon, UserIcon } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function AuthButton() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" className="px-4 py-2 text-sm font-medium text-blue-600 duration-200 hover:text-blue-500 border-blue-500 rounded-full shadow-none">
            <UserCircleIcon />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton appearance={{
          elements: {
            avatarBox: {
              width: "38px",
              height: "38px",
            },
          },
        }} >
          <UserButton.MenuItems>
            <UserButton.Link label="My profile" href="/users/current" labelIcon={<UserIcon className="size-4" />} />
            <UserButton.Link label="Studio" href="/studio" labelIcon={<ClapperboardIcon className="size-4" />} />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>

      </SignedIn>
    </>
  )
}
