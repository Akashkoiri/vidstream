// app/browse/upcoming/upcoming-grid.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getUpcomingMovies, getImageUrl } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import MoviePagination from "@/components/movie-pagination";
import { Spinner } from "@/components/ui/spinner";

export function UpcomingGrid({ page }: { page: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming", page],
    queryFn: () => getUpcomingMovies(page),
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !data) {
    return <p>Failed to load upcoming movies.</p>;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium">Upcoming</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.results.slice(0, 12).map((m) => {
          const year = m.release_date
            ? new Date(m.release_date).getFullYear()
            : "—";
          const poster = getImageUrl(m.poster_path);

          return (
            <Link key={m.id} href={`/watch/movie/${m.id}`}>
              <Card className="py-0 gap-0 group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 transition hover:border-cyan-500/30">
                <div className="relative aspect-2/3 w-full overflow-hidden">
                  {poster && (
                    <Image
                      src={poster}
                      alt={m.title}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  )}
                </div>

                <CardContent className="space-y-1 p-3">
                  <p className="line-clamp-1 text-md font-medium transition-colors duration-200 group-hover:text-cyan-400">
                    {m.title}
                  </p>
                  <p className="text-xs text-slate-400">{year}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="pt-6">
        <MoviePagination page={page} totalPages={data.total_pages} />
      </div>
    </section>
  );
}
