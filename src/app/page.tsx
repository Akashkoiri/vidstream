// app/page.tsx
import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {
  getMedia,
  getTrendingMedia,
  getNowPlayingMovies,
  getMediaByProvider,
  type TmdbMedia,
} from "@/lib/tmdb";
import { NowPlayingHero } from "@/app/browse/now-playing-hero";
import { MovieCard } from "@/components/movie-card";
import { ResponsiveBanner } from "@/components/ResponsiveBanner";
import { CarouselScroller } from "@/app/playlists/carousel-scroller";
export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const username = session?.user.email?.split("@")[0] ?? "Guest";

  // Batch requests to prevent ECONNRESET from too many concurrent TMDB fetches
  const [
    { media: trendingMovies },
    { media: topRatedMovies },
    { media: trendingTv },
  ] = await Promise.all([
    getTrendingMedia({ type: "movie", timeWindow: "day" }),
    getMedia({ type: "movie", page: 1, sort: "top_rated" }),
    getTrendingMedia({ type: "tv", timeWindow: "day" }),
  ]);

  const [{ media: topRatedTv }, nowPlaying, { media: netflixMovies }] =
    await Promise.all([
      getMedia({ type: "tv", page: 1, sort: "top_rated" }),
      getNowPlayingMovies(),
      getMediaByProvider({ providerId: 8, type: "movie" }),
    ]);

  const [
    { media: primeMovies },
    { media: disneyMovies },
    { media: maxMovies },
  ] = await Promise.all([
    getMediaByProvider({ providerId: 9, type: "movie" }),
    getMediaByProvider({ providerId: 337, type: "movie" }),
    getMediaByProvider({ providerId: 1899, type: "movie" }),
  ]);

  return (
    <div className="min-h-screen w-full bg-transparent text-zinc-50">
      <div className="mx-auto flex max-w-full flex-col gap-5">
        {/* HERO: TMDB carousel */}
        {nowPlaying.length > 0 && (
          <section>
            <NowPlayingHero movies={nowPlaying} username={username} />
          </section>
        )}

        <ResponsiveBanner />

        <div className="px-4 pb-5 sm:px-6 lg:px-8 lg:pt-10">
          {/* CTA STRIP UNDER HERO */}
          <section className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
                Streaming reinvented
              </p>
              <h1 className="text-lg font-semibold text-zinc-100 sm:text-xl">
                Watch movies & series in a cinematic, distraction-free
                experience.
              </h1>
            </div>
          </section>

          {/* ROWS */}
          <section className="space-y-8 pt-4">
            <div className="space-y-6">
              <MovieRow
                title="Trending Movies"
                media={trendingMovies}
                href="/browse?type=movie&sort=trending"
              />
              <MovieRow
                title="Trending TV Shows"
                media={trendingTv}
                href="/browse?type=tv&sort=trending"
              />
              <MovieRow
                title="Popular on Netflix"
                media={netflixMovies}
                href="/browse?type=movie&sort=netflix"
              />
              <MovieRow
                title="Popular on Prime Video"
                media={primeMovies}
                href="/browse?type=movie&sort=prime"
              />
              <MovieRow
                title="Popular on Disney+"
                media={disneyMovies}
                href="/browse?type=movie&sort=disney"
              />
              <MovieRow
                title="Popular on HBO Max"
                media={maxMovies}
                href="/browse?type=movie&sort=max"
              />
              <MovieRow
                title="Top Rated Movies"
                media={topRatedMovies}
                href="/browse?type=movie&sort=top_rated"
              />
              <MovieRow
                title="Top Rated TV Shows"
                media={topRatedTv}
                href="/browse?type=tv&sort=top_rated"
              />
            </div>
          </section>
        </div>

        <ResponsiveBanner />
      </div>
    </div>
  );
}

type MovieRowProps = {
  title: string;
  media: TmdbMedia[];
  href?: string;
};

function MovieRow({ title, media, href }: MovieRowProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
          {title}
        </h3>
        {href && (
          <Link
            href={href}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      <CarouselScroller>
        {media.slice(0, 12).map((item) => (
          <div
            key={item.id}
            className="w-28 shrink-0 sm:w-40 md:w-48 lg:w-56 snap-start"
          >
            <MovieCard movie={item} />
          </div>
        ))}
      </CarouselScroller>
    </div>
  );
}
