"use client"

import { SearchIcon, XIcon } from "lucide-react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const SearchInput = () => {
    const [value, setValue] = useState("");

    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const url = new URL("/search", process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        const newQuery = value.trim();

        url.searchParams.set("query", encodeURIComponent(newQuery));

        if (newQuery === "") {
            url.searchParams.delete("query");
        }
        setValue(newQuery);
        router.push(url.toString());
    }
    return (
        <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
            <div className="relative w-full">
                <input value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="Search" className="w-full pl-4 py-2 pr-12 border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 duration-200 rounded-l-full" />
                {value && (
                    <Button type="button" variant={'ghost'} size={'icon'} onClick={() => setValue("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                        <XIcon className="size-5 text-muted-foreground" />
                    </Button>
                )}
            </div>
            <button
                disabled={!value.trim()}
                type="submit"
                className="px-5 py-2.5 bg-secondary border border-l-0 rounded-r-full
                hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SearchIcon className="size-5" />
            </button>
        </form>
    )
}