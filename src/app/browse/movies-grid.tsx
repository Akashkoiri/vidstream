// app/browse/movies-grid.tsx
import type { TmdbMovie } from "@/lib/tmdb";
import { PaginationControls } from "./pagination-controls";
import { SortTabs } from "./sort-tabs";
import { MovieCard } from "@/components/movie-card";

type Props = {
  movies: TmdbMovie[];
  page: number;
  totalPages: number;
  sort: "popular" | "top_rated" | "upcoming";
};

export function MoviesGrid({ movies, page, totalPages, sort }: Props) {
  return (
    <section className="w-full max-w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-medium sm:text-lg">Browse movies</h2>
        <div className="sm:self-end">
          <SortTabs sort={sort} />
        </div>
      </div>

      <div
        className="
          grid w-full max-w-full
          grid-cols-3 gap-3
          xs:grid-cols-3
          sm:grid-cols-4
          md:grid-cols-5
        "
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <PaginationControls page={page} totalPages={totalPages} />
    </section>
  );
}
