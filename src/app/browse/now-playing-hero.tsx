"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { TmdbMovie } from "@/lib/tmdb";
import { Badge } from "@/components/ui/badge";

// TMDB Image Helper
function getImageUrl(
  path: string | null | undefined,
  size: "w780" | "original" = "w780"
) {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

type Props = {
  movies: TmdbMovie[];
  username: string;
};

const AUTOPLAY_INTERVAL = 12000;

export function NowPlayingHero({ movies }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [movies.length]);

  if (!movies.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-slate-950">
      {/* SLIDES WRAPPER */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {movies.map((movie, i) => (
          <HeroSlide
            key={movie.id}
            movie={movie}
            isActive={i === index}
            index={i}
          />
        ))}
      </div>

      {/* DOTS */}
      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center">
        <div className="flex gap-2">
          {movies.slice(0, movies.length).map((m, i) => (
            <button
              key={m.id}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-cyan-400"
                  : "w-2 bg-slate-500 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type SlideProps = {
  movie: TmdbMovie;
  isActive: boolean;
  index: number;
};

function HeroSlide({ movie, isActive, index }: SlideProps) {
  const backdrop = getImageUrl(movie.backdrop_path, "original");
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <article className="relative min-w-full overflow-hidden h-[65vh] sm:h-[70vh] md:h-[75vh] flex items-center">
      {/* BACKDROP IMAGE */}
      {backdrop && (
        <div className="absolute inset-0">
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-700 ${
              isActive ? "opacity-45" : "opacity-30"
            }`}
          />
          {/* DARK GRADIENT */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>
      )}

      {/* TEXT CONTENT */}
      <div className="relative z-10 max-w-4xl px-6 sm:px-10 md:px-14 translate-y-[30%]">
        <p className="text-sm uppercase tracking-widest text-cyan-300/80">
          Now Playing
        </p>

        <h1 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl leading-tight">
          {movie.title}
        </h1>

        <div className="flex items-center gap-3 mt-3 text-sm text-slate-200">
          {year && <span className="opacity-80">{year}</span>}
          <Badge className="bg-cyan-500 text-slate-950 text-xs">
            In theatres
          </Badge>
        </div>

        <p className="mt-3 max-w-xl text-slate-300 text-sm sm:text-base line-clamp-3">
          {movie.overview || "No description available."}
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/watch/movie/${movie.id}`}
            className="rounded-full bg-cyan-500 text-slate-950 px-6 py-2 text-sm font-semibold shadow-md hover:bg-cyan-400 transition"
          >
            ▶ Watch Now
          </Link>
        </div>
      </div>
    </article>
  );
}
