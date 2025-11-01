import SearchView from "@/modules/search/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

interface SearchProps {
    searchParams: Promise<{
        query: string | undefined;
        categoryId: string | undefined;
    }>
}

export async function generateMetadata({ searchParams }: SearchProps): Promise<Metadata> {
    const { query} = await searchParams;
    return {
        title: `Search for ${query}`,
    }
}

export default async function Search({ searchParams }: SearchProps) {
    const { query, categoryId } = await searchParams;
    void trpc.categories.getMany.prefetch();
    void trpc.search.getMany.prefetchInfinite({
        query,
        categoryId,
        limit: 10,
    });
    return (
        <HydrateClient>
            <SearchView query={query} categoryId={categoryId} />
        </HydrateClient>
    )
}
