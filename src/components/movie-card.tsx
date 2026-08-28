// components/movie-card.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl, type TmdbMedia } from "@/lib/tmdb";
import { AddToPlaylistButton } from "@/components/AddToPlaylistButton";

type MovieCardProps = {
  movie: TmdbMedia;
  /** show the "+ Playlist" button overlay; defaults to true */
  showAddToPlaylistButton?: boolean;
};

export function MovieCard({
  movie,
  showAddToPlaylistButton = true,
}: MovieCardProps) {
  const poster = getImageUrl(movie.poster_path);
  const title = movie.title || movie.name || "Untitled";
  const dateStr = movie.release_date || movie.first_air_date;
  const year = dateStr ? new Date(dateStr).getFullYear() : "—";
  const type = movie.media_type || (movie.name ? "tv" : "movie");

  return (
    <div className="relative">
      {showAddToPlaylistButton && (
        <div className="absolute right-2 top-2 z-1">
          <AddToPlaylistButton movieId={movie.id} mediaType={type as "movie" | "tv"} />
        </div>
      )}

      <Link key={movie.id} href={`/watch/${type}/${movie.id}`} className="block">
        <Card className="group overflow-hidden rounded-lg border-slate-800 bg-slate-900/70 p-0 gap-2">
          <div className="relative aspect-2/3 w-full bg-linear-to-br from-slate-800 to-slate-900">
            {poster && (
              <Image
                src={poster}
                alt={title}
                fill
                sizes="(min-width: 1024px) 15vw, (min-width: 640px) 25vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>

          <CardContent className="space-y-1 p-1.5 sm:p-2">
            <p className="line-clamp-1 text-[16px] font-medium sm:text-md group-hover:text-cyan-400">
              {title}
            </p>
            <p className="text-[10px] text-slate-400 sm:text-[12px]">{year}</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
