// components/movie-card.tsx
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl, type TmdbMedia } from "@/lib/tmdb";
import { AddToPlaylistButton } from "@/components/AddToPlaylistButton";
import { Star } from "lucide-react";

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
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <div className="relative group/card">
      {showAddToPlaylistButton && (
        <div className="absolute right-2 top-2 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
          <AddToPlaylistButton movieId={movie.id} mediaType={type as "movie" | "tv"} />
        </div>
      )}

      <Link key={movie.id} href={`/watch/${type}/${movie.id}`} className="block">
        <Card className="group overflow-hidden rounded-xl border-white/5 bg-zinc-950/50 backdrop-blur-sm p-0 gap-0 transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 transform-gpu">
          <div className="relative aspect-2/3 w-full overflow-hidden transform-gpu bg-linear-to-br from-zinc-900 to-black">
            {poster && (
              <Image
                src={poster}
                alt={title}
                fill
                sizes="(min-width: 1024px) 15vw, (min-width: 640px) 25vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100 will-change-transform"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <CardContent className="space-y-1 p-2 sm:p-3 relative z-10">
            <p className="line-clamp-1 text-[16px] font-semibold text-zinc-100 sm:text-md transition-colors group-hover:text-white">
              {title}
            </p>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 sm:text-[12px]">
              <p>{year}</p>
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <span>{rating}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
