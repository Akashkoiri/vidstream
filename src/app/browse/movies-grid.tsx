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

export function MoviesGrid({ movies, page, totalPages, sort }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium">Browse movies</h2>
        <SortTabs sort={sort} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {movies.slice(0, 12).map((m) => {
          const year = m.release_date
            ? new Date(m.release_date).getFullYear()
            : "—";
          const poster = getImageUrl(m.poster_path);

          return (
            <Link key={m.id} href={`/watch/movie/${m.id}`}>
              <Card className="p-0 gap-0 group overflow-hidden border-slate-800 bg-slate-900/70">
                <div className="relative aspect-2/3 w-full bg-linear-to-br from-slate-800 to-slate-900">
                  {poster && (
                    <Image
                      src={poster}
                      alt={m.title}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <CardContent className="space-y-1 p-3">
                  <p className="line-clamp-1 text-sm font-medium group-hover:text-cyan-400">
                    {m.title}
                  </p>
                  <p className="text-xs text-slate-400">{year}</p>
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
