// src/lib/tmdb.ts
const TMDB_BASE_URL = "https://api.themoviedb.org/3";



export type TmdbMedia = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
  backdrop_path?: string;
  overview?: string;
  media_type?: "movie" | "tv";
  vote_average?: number;
};

export async function getMedia(options: {
  type: "movie" | "tv";
  page: number;
  sort: "popular" | "top_rated" | "upcoming" | "on_the_air";
}) {
  const { type, page, sort } = options;
  const actualSort = type === "tv" && sort === "upcoming" ? "on_the_air" : sort;

  const ITEMS_PER_PAGE = 21;
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE; // exclusive

  const startPage = Math.floor(startIdx / 20) + 1;
  const endPage = Math.floor((endIdx - 1) / 20) + 1;

  const fetchTmdbPage = async (p: number) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/${actualSort}?language=en-US&page=${p}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
    return res.json();
  };

  const startData = await fetchTmdbPage(startPage);
  let results = startData.results as TmdbMedia[];

  if (endPage > startPage && startPage < startData.total_pages) {
    const endData = await fetchTmdbPage(endPage);
    results = [...results, ...(endData.results as TmdbMedia[])];
  }

  const offset = startIdx % 20;
  const media = results.slice(offset, offset + ITEMS_PER_PAGE);
  
  // Calculate total pages based on our new page size (assume 20 items per TMDB page)
  const totalResults = startData.total_results || (startData.total_pages * 20);
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  return {
    media,
    totalPages,
  };
}

export async function getTrendingMedia(options: {
  type: "movie" | "tv" | "all";
  timeWindow?: "day" | "week";
  page?: number;
}) {
  const { type, timeWindow = "day", page = 1 } = options;
  
  const res = await fetch(
    `${TMDB_BASE_URL}/trending/${type}/${timeWindow}?language=en-US&page=${page}`,
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
    media: data.results as TmdbMedia[],
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
      next: { revalidate: 600 },
    }
  );

  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }

  const data = await res.json();
  // return data.results as TmdbMedia[];
  return (data.results as TmdbMedia[]).slice(0, 10);
}

// 🔎 NEW: search endpoint
export async function searchMedia(options: { query: string; page?: number }) {
  const { query, page = 1 } = options;

  const params = new URLSearchParams({
    query,
    include_adult: "false",
    language: "en-US",
    page: String(page),
  });

  const res = await fetch(
    `${TMDB_BASE_URL}/search/multi?${params.toString()}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error(`TMDB search error: ${res.status}`);
  }

  const data = await res.json();
  // Filter out people or other unwanted media types, keep only movie and tv
  const results = (data.results as TmdbMedia[]).filter(
    (item) => item.media_type === "movie" || item.media_type === "tv"
  );
  
  return {
    results,
    totalPages: data.total_pages as number,
  };
}

export function getImageUrl(
  path: string | null | undefined,
  size: "w500" | "original" = "w500"
) {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function getMovieById(id: number | string) {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?language=en-US`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
    // tweak if you want SSR-only or ISR, but this is fine:
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB getMovieById error: ${res.status}`);
  }

  return (await res.json()) as TmdbMedia;
}

export async function getTvShowById(id: number | string) {
  const res = await fetch(`${TMDB_BASE_URL}/tv/${id}?language=en-US`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
    // tweak if you want SSR-only or ISR, but this is fine:
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB getTvShowById error: ${res.status}`);
  }

  const data = await res.json();
  // Ensure media_type is set since TV shows endpoint might not return it
  return { ...data, media_type: "tv" } as TmdbMedia;
}

export async function getMediaByProvider(options: {
  providerId: number;
  type?: "movie" | "tv";
  page?: number;
}) {
  const { providerId, type = "movie", page = 1 } = options;
  
  const params = new URLSearchParams({
    with_watch_providers: String(providerId),
    watch_region: "US",
    language: "en-US",
    page: String(page),
    sort_by: "popularity.desc"
  });

  const res = await fetch(
    `${TMDB_BASE_URL}/discover/${type}?${params.toString()}`,
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
  
  // Inject media_type into each item since /discover doesn't always provide it
  const results = (data.results as TmdbMedia[]).map(item => ({
    ...item,
    media_type: type
  }));

  return {
    media: results,
    totalPages: data.total_pages as number,
  };
}
