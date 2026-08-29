"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

type Media = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string | null;
  first_air_date?: string | null;
  poster_path: string | null;
  overview?: string | null;
  media_type: "movie" | "tv";
};

const getImageUrl = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w200${path}` : null;

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setMedia([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      const performSearch = async () => {
        setIsLoading(true);
        setHasSearched(true);
        try {
          const params = new URLSearchParams({ query: trimmed });
          const res = await fetch(`/api/search?${params.toString()}`);
          if (!res.ok) throw new Error("Search failed");

          const data = await res.json();
          setMedia(data.results ?? []);
        } catch (error) {
          console.error(error);
          setMedia([]);
        } finally {
          setIsLoading(false);
        }
      };

      performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);

        // optional: reset when closing
        if (!v) {
          setQuery("");
          setMedia([]);
          setHasSearched(false);
          setIsLoading(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-zinc-700 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-zinc-100 hover:text-white transition-colors drop-shadow-md"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        // ✅ key changes: flex column + overflow hidden + responsive height/width
        className="
          flex flex-col gap-4
          border-white/10 bg-black/95 backdrop-blur-xl text-zinc-50
          sm:max-w-[80vw] lg:max-w-4xl       /* ⬅ hard cap */
          h-[85vh]
          overflow-hidden
        "
        onOpenAutoFocus={(e) => {
          // optional: focus input when opened
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Search The Movie Database for movies and TV shows.
          </DialogDescription>
        </DialogHeader>

        <div className="shrink-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies and TV shows…"
            className="w-full bg-zinc-900/80 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 pl-9"
          />
        </div>

        {/* ✅ key change: this fills the remaining space and scrolls */}
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
          {isLoading && (
            <div className="flex items-center justify-center py-10 text-sm text-zinc-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Searching…
            </div>
          )}

          {!isLoading && !media.length && hasSearched && (
            <p className="py-4 text-sm text-zinc-400">
              No results found for “{query.trim()}”.
            </p>
          )}

          {!isLoading && media.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {media.map((item) => {
                const poster = getImageUrl(item.poster_path);
                const date = item.release_date || item.first_air_date;
                const year = date ? new Date(date).getFullYear() : "—";
                const title = item.title || item.name;

                return (
                  <Link
                    key={item.id}
                    href={`/watch/${item.media_type}/${item.id}`}
                    onClick={() => setOpen(false)}
                  >
                    <Card className="group overflow-hidden border-white/5 bg-zinc-950/50 backdrop-blur-sm p-0 gap-1 h-full transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                      <div className="relative aspect-2/3 w-full bg-zinc-900">
                        {poster && (
                          <Image
                            src={poster}
                            alt={title ?? "Media"}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute top-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                          {item.media_type === "movie" ? "Movie" : "TV"}
                        </div>
                      </div>
                      <CardContent className="p-2">
                        <p className="line-clamp-1 text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                          {title}
                        </p>
                        <p className="text-xs text-zinc-500">{year}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}


        </div>
      </DialogContent>
    </Dialog>
  );
}
