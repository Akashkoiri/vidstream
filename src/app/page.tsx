// app/page.tsx
import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getMovies, getNowPlayingMovies, type TmdbMovie } from "@/lib/tmdb";
import { NowPlayingHero } from "@/app/browse/now-playing-hero";
import { MovieCard } from "@/components/movie-card";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const username = session?.user.email?.split("@")[0] ?? "Guest";

  const [
    { movies: popular },
    { movies: topRated },
    { movies: upcoming },
    nowPlaying,
  ] = await Promise.all([
    getMovies({ page: 1, sort: "popular" }),
    getMovies({ page: 1, sort: "top_rated" }),
    getMovies({ page: 1, sort: "upcoming" }),
    getNowPlayingMovies(),
  ]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-full flex-col gap-5">
        {/* HERO: TMDB carousel */}
        {nowPlaying.length > 0 && (
          <section>
            <NowPlayingHero movies={nowPlaying} username={username} />
          </section>
        )}

        <div className="px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          {/* CTA STRIP UNDER HERO */}
          <section className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
                Streaming reinvented
              </p>
              <h1 className="text-lg font-semibold text-slate-100 sm:text-xl">
                Watch movies & series in a cinematic, distraction-free
                experience.
              </h1>
            </div>
            <Link
              href="/browse"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 sm:text-sm"
            >
              View catalog →
            </Link>
          </section>

          {/* ROWS */}
          <section className="space-y-8 pt-4">
            <div className="space-y-6">
              <MovieRow title="Trending Now" movies={popular} />
              <MovieRow title="Top Rated" movies={topRated} />
              <MovieRow title="Coming Soon" movies={upcoming} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

type MovieRowProps = {
  title: string;
  movies: TmdbMovie[];
};

function MovieRow({ title, movies }: MovieRowProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-100 sm:text-base">
        {title}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {movies.slice(0, 12).map((movie) => (
          <div key={movie.id} className="w-50 shrink-0 sm:w-52 md:w-56">
            {/* Same MovieCard as browse page */}
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
