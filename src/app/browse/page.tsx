// app/browse/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { loadBrowseSearchParams } from "./search-params";
import { getMovies } from "@/lib/tmdb";
import { MoviesGrid } from "./movies-grid";
import { Spinner } from "@/components/ui/spinner";

type BrowsePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login");

  const { page, sort } = await loadBrowseSearchParams(searchParams);

  const { movies, totalPages } = await getMovies({ page, sort });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col space-y-8 px-3 py-4 sm:px-4 sm:py-6">
      <Suspense fallback={<Spinner />}>
        <div id="browse-grid">
          <MoviesGrid
            movies={movies}
            page={page}
            totalPages={totalPages}
            sort={sort}
          />
        </div>
      </Suspense>
    </div>
  );
}
