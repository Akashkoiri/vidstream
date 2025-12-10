// app/browse/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { loadBrowseSearchParams } from "./search-params";
import { getMovies, getNowPlayingMovies } from "@/lib/tmdb";
import { MoviesGrid } from "./movies-grid";
import { NowPlayingHero } from "./now-playing-hero";

type BrowsePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login");

  const { page, sort } = await loadBrowseSearchParams(searchParams);

  const [{ movies, totalPages }, nowPlaying] = await Promise.all([
    getMovies({ page, sort }),
    getNowPlayingMovies(),
  ]);

  const username = session.user.email?.split("@")[0] ?? "Guest";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      <NowPlayingHero movies={nowPlaying} username={username} />

      <Suspense fallback={<p className="text-slate-400">Loading titles…</p>}>
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
