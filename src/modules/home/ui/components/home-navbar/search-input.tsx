import { SearchIcon } from "lucide-react"

export const SearchInput = () => {
    // TODO: Add search functionality
    return (
        <form className="flex w-full max-w-[600px]">
            <div className="relative w-full">
                <input type="text" placeholder="Search" className="w-full pl-4 py-2 pr-12 border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 duration-200 rounded-l-full" />
                {/* TODO: Add remove search button */}
            </div>
            <button
                type="submit"
                className="px-5 py-2.5 bg-secondary border border-l-0 rounded-r-full
                hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SearchIcon className="size-5" />
            </button>
        </form>
    )
}