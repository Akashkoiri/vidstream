// app/browse/search/page.tsx
import { searchMovies } from "@/lib/tmdb";
import type { SearchParams } from "nuqs/server";
import { SearchBar } from "./search-bar";
import { SearchResultsGrid } from "./search-results-grid";

type SearchPageProps = {
  searchParams: SearchParams;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.query as string | undefined) ?? "";
  const pageParam = (params.page as string | undefined) ?? "1";
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;

  const { movies, totalPages } = await searchMovies({ query, page });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col space-y-6 px-3 py-4 sm:px-4 sm:py-6">
      <SearchBar defaultValue={query} />

      <SearchResultsGrid
        query={query}
        movies={movies}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
