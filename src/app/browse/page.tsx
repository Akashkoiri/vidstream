import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { loadBrowseSearchParams } from "./search-params";
import { getMedia } from "@/lib/tmdb";
import { MoviesGrid } from "./movies-grid";
import { Spinner } from "@/components/ui/spinner";

type BrowsePageProps = {
  searchParams: Promise<SearchParams>;
};

async function BrowseData({ type, page, sort }: { type: "movie" | "tv", page: number, sort: "popular" | "top_rated" | "upcoming" }) {
  const { media, totalPages } = await getMedia({ type, page, sort });
  
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
    <div className="mx-auto flex w-full flex-col space-y-8 px-3 sm:px-4 sm:py-6">
      <Suspense key={suspenseKey} fallback={<div className="flex w-full items-center justify-center py-20"><Spinner /></div>}>
        <div id="browse-grid">
          <BrowseData type={type} page={page} sort={sort} />
        </div>
      </Suspense>
    </div>
  );
}
