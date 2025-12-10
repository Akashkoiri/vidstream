// src/lib/tmdb.ts
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!process.env.TMDB_ACCESS_TOKEN) {
  throw new Error("TMDB_ACCESS_TOKEN is not set");
}

export type TmdbMovie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
};

export async function getMovies(options: {
  page: number;
  sort: "popular" | "top_rated" | "upcoming";
}) {
  const { page, sort } = options;

  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${sort}?language=en-US&page=${page}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }

  const data = await res.json();
  return {
    movies: data.results as TmdbMovie[],
    totalPages: data.total_pages as number,
  };
}

export async function getNowPlayingMovies() {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/now_playing?language=en-US&page=1`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
      // refresh a bit more often for "now playing"
      next: { revalidate: 600 },
    }
  );

  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }

  const data = await res.json();
  return data.results as TmdbMovie[];
}

export function getImageUrl(
  path: string | null,
  size: "w500" | "original" = "w500"
) {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
