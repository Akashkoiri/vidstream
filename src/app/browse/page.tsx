import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { loadBrowseSearchParams } from "./search-params";
import { getMedia, getTrendingMedia, getMediaByProvider } from "@/lib/tmdb";
import { MoviesGrid } from "./movies-grid";
import { Spinner } from "@/components/ui/spinner";
import { ResponsiveBanner } from "@/components/ResponsiveBanner";

type BrowsePageProps = {
  searchParams: Promise<SearchParams>;
};

async function BrowseData({ type, page, sort }: { type: "movie" | "tv", page: number, sort: "popular" | "top_rated" | "upcoming" | "trending" | "netflix" | "prime" | "disney" | "max" }) {
  let media, totalPages;

  if (sort === "trending") {
    const res = await getTrendingMedia({ type, timeWindow: "day", page });
    media = res.media;
    totalPages = res.totalPages;
  } else if (sort === "netflix") {
    const res = await getMediaByProvider({ providerId: 8, type, page });
    media = res.media;
    totalPages = res.totalPages;
  } else if (sort === "prime") {
    const res = await getMediaByProvider({ providerId: 9, type, page });
    media = res.media;
    totalPages = res.totalPages;
  } else if (sort === "disney") {
    const res = await getMediaByProvider({ providerId: 337, type, page });
    media = res.media;
    totalPages = res.totalPages;
  } else if (sort === "max") {
    const res = await getMediaByProvider({ providerId: 1899, type, page });
    media = res.media;
    totalPages = res.totalPages;
  } else {
    const res = await getMedia({ type, page, sort });
    media = res.media;
    totalPages = res.totalPages;
  }
  
  return (
    <MoviesGrid
      media={media}
      page={page}
      totalPages={totalPages}
      sort={sort}
      type={type}
    />
  );
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { page, sort, type } = await loadBrowseSearchParams(searchParams);

  const suspenseKey = `${type}-${sort}-${page}`;

  return (
    <div className="mx-auto flex w-full flex-col space-y-8 px-3 pt-16 pb-6 sm:px-4 sm:pb-8">
      <ResponsiveBanner />
      <Suspense key={suspenseKey} fallback={<div className="flex w-full items-center justify-center py-20"><Spinner /></div>}>
        <div id="browse-grid">
          <BrowseData type={type} page={page} sort={sort} />
        </div>
      </Suspense>
    </div>
  );
}
