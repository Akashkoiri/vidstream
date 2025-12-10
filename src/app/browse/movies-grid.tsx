import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl, type TmdbMovie } from "@/lib/tmdb";
import { PaginationControls } from "./pagination-controls";
import { SortTabs } from "./sort-tabs";

type Props = {
  movies: TmdbMovie[];
  page: number;
  totalPages: number;
  sort: "popular" | "top_rated" | "upcoming";
};

// MoviesGrid.tsx
export function MoviesGrid({ movies, page, totalPages, sort }: Props) {
  return (
    <section className="space-y-4 w-full max-w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-medium sm:text-lg">Browse movies</h2>
        <div className="sm:self-end">
          <SortTabs sort={sort} />
        </div>
      </div>

      {/* Smaller grid, tighter spacing, more compact cards */}
      <div
        className="grid w-full max-w-full 
                      grid-cols-3 gap-2 
                      xs:grid-cols-3 
                      sm:grid-cols-4 
                      md:grid-cols-5"
      >
        {movies.slice(0, 15).map((m) => {
          const year = m.release_date
            ? new Date(m.release_date).getFullYear()
            : "—";
          const poster = getImageUrl(m.poster_path);

          return (
            <Link key={m.id} href={`/watch/movie/${m.id}`} className="block">
              <Card className="group overflow-hidden border-slate-800 bg-slate-900/70 p-0 rounded-lg">
                {/* Smaller aspect ratio → shorter cards */}
                <div className="relative aspect-2/3 w-full bg-linear-to-br from-slate-800 to-slate-900">
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

                {/* Smaller padding + smaller text */}
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
