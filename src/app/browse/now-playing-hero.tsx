"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { TmdbMovie } from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";

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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(id);
  }, [movies.length]);

  if (!movies.length) return null;

  return (
    <section className="relative w-full max-w-full overflow-hidden bg-slate-950">
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4 sm:px-6 sm:pb-5 md:px-8">
        <div className="pointer-events-auto flex max-w-xs flex-1 justify-center gap-1 sm:justify-center">
          {movies.slice(0, 10).map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
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

type SlideProps = {
  movie: TmdbMovie;
  username: string;
  isActive: boolean;
  index: number;
};

function HeroSlide({ movie, isActive, index }: SlideProps) {
  const backdrop = getImageUrl(movie.backdrop_path, "w500");
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <article className="relative min-w-full overflow-hidden">
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
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/85 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex min-h-[220px] flex-col gap-4 p-8 pb-0  sm:min-h-[260px] sm:gap-6 md:min-h-[320px]">
        <div className="max-w-xl space-y-3 sm:max-w-3xl sm:space-y-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-400/80 sm:text-xs">
            Now playing in theatres
          </p>
          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
            {movie.title}
          </h1>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-200 sm:gap-2 sm:text-sm">
              {year && <span className="font-medium">{year}</span>}
              <Badge className="bg-cyan-500/90 text-[10px] text-slate-950 sm:text-xs">
                Now playing
              </Badge>
            </div>
            <p className="max-w-xl text-xs text-slate-200/90 line-clamp-3 sm:text-sm">
              {movie.overview || "No synopsis available yet."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 sm:gap-3 sm:pt-2">
            <Link
              href={`/watch/movie/${movie.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 sm:px-5"
            >
              ▶ Watch now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
