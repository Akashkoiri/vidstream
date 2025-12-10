// lib/tmdb.ts
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
};

export type TmdbMoviePage = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

async function fetchMoviePage(
  path: string,
  page: number
): Promise<TmdbMoviePage> {
  const res = await fetch(
    `${TMDB_BASE_URL}${path}?language=en-US&page=${page}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`TMDB request failed for ${path}`);
  }

  return res.json();
}

export function getImageUrl(path: string | null, size: string = "w500") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getPopularMovies(page = 1) {
  return fetchMoviePage("/movie/popular", page);
}

export function getUpcomingMovies(page = 1) {
  return fetchMoviePage("/movie/upcoming", page);
}

export function getNowPlaying(page = 1) {
  return fetchMoviePage("/movie/now_playing", page);
}

export function getTopRatedMovies(page = 1) {
  return fetchMoviePage("/movie/top_rated", page);
}
