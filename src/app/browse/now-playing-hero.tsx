"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type TmdbMedia, getImageUrl } from "@/lib/tmdb";
import { Star } from "lucide-react";

type Props = {
  movies: TmdbMedia[];
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
    <section className="relative w-full overflow-hidden bg-transparent">
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
      <div className="absolute inset-x-0 bottom-6 md:bottom-8 z-20 flex justify-center">
        <div className="flex gap-2">
          {movies.slice(0, movies.length).map((m, i) => (
            <button
              key={m.id}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all shadow-sm ${i === index
                  ? "w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  : "w-2 bg-zinc-600 hover:bg-zinc-400"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type SlideProps = {
  movie: TmdbMedia;
  isActive: boolean;
  index: number;
};

function HeroSlide({ movie, isActive, index }: SlideProps) {
  const backdrop = getImageUrl(movie.backdrop_path, "original");
  const title = movie.title || movie.name || "Untitled";
  const dateStr = movie.release_date || movie.first_air_date;
  const year = dateStr
    ? new Date(dateStr).getFullYear()
    : null;
  const type = movie.media_type || (movie.name ? "tv" : "movie");
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <article className="relative flex min-w-full items-end overflow-hidden h-[100svh] pb-12 sm:pb-16 md:pb-20">
      {/* BACKDROP IMAGE */}
      {backdrop && (
        <div className="absolute inset-0">
          <Image
            src={backdrop}
            alt={title}
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-700 ${isActive ? "opacity-80" : "opacity-0"
              }`}
          />
          {/* DARK GRADIENT */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        </div>
      )}

      {/* TEXT CONTENT */}
      <div className="relative z-10 max-w-4xl px-4 sm:px-10 md:px-14">
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          Now Playing
        </p>

        <h1 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl leading-tight text-white drop-shadow-md">
          {title}
        </h1>

        <div className="flex items-center gap-3 mt-3 text-sm text-zinc-300">
          {year && <span className="opacity-80">{year}</span>}
          {rating && (
            <div className="flex items-center gap-1 opacity-80">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">{rating}</span>
            </div>
          )}
        </div>

        <p className="mt-3 max-w-xl text-zinc-300 text-sm sm:text-base line-clamp-3 drop-shadow-sm">
          {movie.overview || "No description available."}
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/watch/${type}/${movie.id}`}
            className="rounded-full bg-white text-black px-6 py-2 text-sm font-semibold shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:bg-zinc-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all"
          >
          Watch Now
          </Link>
        </div>
      </div>
    </article>
  );
}
