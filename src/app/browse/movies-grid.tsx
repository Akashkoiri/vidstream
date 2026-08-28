// app/browse/movies-grid.tsx
import type { TmdbMedia } from "@/lib/tmdb";
import { PaginationControls } from "./pagination-controls";
import { SortTabs } from "./sort-tabs";
import { TypeTabs } from "./type-tabs";
import { MovieCard } from "@/components/movie-card";

type Props = {
  media: TmdbMedia[];
  page: number;
  totalPages: number;
  sort: "popular" | "top_rated" | "upcoming";
  type: "movie" | "tv";
};

export function MoviesGrid({ media, page, totalPages, sort, type }: Props) {
  return (
    <section className="w-full max-w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-medium sm:text-lg">
          Browse {type === "movie" ? "Movies" : "TV Shows"}
        </h2>
        <div className="flex items-center gap-2 sm:self-end">
          <TypeTabs type={type} />
          <SortTabs sort={sort} />
        </div>
      </div>

      <div
        className="
          grid w-full max-w-full
          grid-cols-2 gap-4
          sm:grid-cols-4
          md:grid-cols-5
          lg:grid-cols-6
          xl:grid-cols-7
        "
      >
        {media.map((item, index) => (
          <MovieCard key={`${item.id}-${index}`} movie={item} />
        ))}
      </div>

      <PaginationControls page={page} totalPages={totalPages} />
    </section>
  );
}
