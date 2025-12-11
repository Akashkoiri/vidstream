// app/browse/search/search-results-grid.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationControls } from "../pagination-controls";
import { getImageUrl, type TmdbMovie } from "@/lib/tmdb";

type Props = {
  query: string;
  movies: TmdbMovie[];
  page: number;
  totalPages: number;
};

export function SearchResultsGrid({ query, movies, page, totalPages }: Props) {
  const trimmed = query.trim();

  if (!trimmed) {
    return (
      <p className="text-sm text-slate-400">
        Type a movie title above to see matching results.
      </p>
    );
  }

  if (!movies.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-base font-medium sm:text-lg">
          No results for “{trimmed}”
        </h2>
        <p className="text-sm text-slate-400">
          Try another title or check your spelling.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-full space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-medium sm:text-lg">
          Results for “{trimmed}”
        </h2>
        <p className="text-xs text-slate-400">
          Showing {movies.length} movies on page {page}
        </p>
      </div>

      <div
        className="
          grid w-full max-w-full
          grid-cols-3 gap-2
          xs:grid-cols-3
          sm:grid-cols-4
          md:grid-cols-5
        "
      >
        {movies.map((m) => {
          const year = m.release_date
            ? new Date(m.release_date).getFullYear()
            : "—";
          const poster = getImageUrl(m.poster_path);

          return (
            <Link key={m.id} href={`/watch/movie/${m.id}`} className="block">
              <Card className="group overflow-hidden rounded-lg border-slate-800 bg-slate-900/70 p-0">
                <div className="relative aspect-[2/3] w-full bg-gradient-to-br from-slate-800 to-slate-900">
                  {poster && (
                    <Image
                      src={poster}
                      alt={m.title}
                      fill
                      sizes="(min-width: 1024px) 15vw, (min-width: 640px) 25vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <CardContent className="space-y-1 p-1.5 sm:p-2">
                  <p className="line-clamp-1 text-[11px] font-medium sm:text-xs group-hover:text-cyan-400">
                    {m.title}
                  </p>
                  <p className="text-[10px] text-slate-400 sm:text-[11px]">
                    {year}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <PaginationControls page={page} totalPages={totalPages} />
    </section>
  );
}
