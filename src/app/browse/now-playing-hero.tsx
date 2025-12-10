"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { TmdbMovie } from "@/lib/tmdb"; // type-only, safe on client
import { Badge } from "@/components/ui/badge";

// local helper – no env usage, safe on client
function getImageUrl(
  path: string | null | undefined,
  size: "w500" | "original" = "original"
) {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

type Props = {
  movies: TmdbMovie[];
  username: string;
};

const AUTOPLAY_INTERVAL = 15000; // ms

export function NowPlayingHero({ movies, username }: Props) {
  // if (!movies.length) return null;

  const [index, setIndex] = useState(0);

  // auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(id);
  }, [movies.length]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
      {/* Slides track */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {movies.map((movie, i) => (
          <HeroSlide
            key={movie.id}
            movie={movie}
            username={username}
            isActive={i === index}
            index={i}
          />
        ))}
      </div>

      {/* Controls overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 px-6 pb-5 md:px-8">
        {/* Dots */}
        <div className="pointer-events-auto flex flex-1 justify-end gap-1">
          {movies.slice(0, 10).map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-cyan-400"
                  : "w-2 bg-slate-600 hover:bg-slate-400"
              }`}
              aria-label={`Go to ${m.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Single slide (full hero)
type SlideProps = {
  movie: TmdbMovie;
  username: string;
  isActive: boolean;
  index: number;
};

function HeroSlide({ movie, username, isActive, index }: SlideProps) {
  const backdrop = getImageUrl(movie.backdrop_path, "original");
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <article className="relative min-w-full overflow-hidden">
      {/* Backdrop (prefetch all by rendering all slides, eager load) */}
      {backdrop && (
        <div className="absolute inset-0">
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "eager"}
            className={`object-cover transition-opacity duration-700 ${
              isActive ? "opacity-40" : "opacity-30"
            }`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex min-h-[260px] flex-col gap-6 p-6 md:min-h-[320px] md:p-8">
        <div className="space-y-4 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/80">
            Now playing in theatres
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Welcome back, <span className="text-cyan-400">{username}</span>
          </h1>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
              <span className="font-medium">{movie.title}</span>
              {year && (
                <span className="text-xs text-slate-300/80">• {year}</span>
              )}
              <Badge className="bg-cyan-500/90 text-slate-950">
                Now playing
              </Badge>
            </div>
            <p className="max-w-xl text-sm text-slate-200/90 line-clamp-3">
              {movie.overview || "No synopsis available yet."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/watch/movie/${movie.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
            >
              ▶ Watch now
            </Link>
            <Link
              href="#browse-grid"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-2 text-xs text-slate-200 hover:border-cyan-500/70 hover:text-cyan-400"
            >
              Browse more
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
