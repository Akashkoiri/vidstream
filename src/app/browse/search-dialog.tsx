"use client";

import { useState } from "react";
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

type Movie = {
  id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
  overview?: string | null;
};

const getImageUrl = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w200${path}` : null;

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({ query: trimmed });
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setMovies(data.movies ?? []);
    } catch (error) {
      console.error(error);
      setMovies([]);
      // optional: show toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 🔍 Icon button */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-slate-700 bg-slate-900/70"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search movies</span>
        </Button>
      </DialogTrigger>

      {/* 🪟 Modal content */}
      <DialogContent className="max-w-3xl sm:max-w-3xl h-[95vh] border-slate-800 bg-slate-950/95">
        <DialogHeader>
          <DialogTitle>Search movies</DialogTitle>
          <DialogDescription>
            Search The Movie Database for any title.
          </DialogDescription>
        </DialogHeader>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie…"
            className="flex-1 bg-slate-900/80"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Search
          </Button>
        </form>

        {/* Results / loading state */}
        <div className="mt-4 max-h-[400px] space-y-3 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-10 text-sm text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Searching…
            </div>
          )}

          {!isLoading && !movies.length && hasSearched && (
            <p className="py-4 text-sm text-slate-400">
              No results found for “{query.trim()}”.
            </p>
          )}

          {!isLoading && movies.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {movies.map((movie) => {
                const poster = getImageUrl(movie.poster_path);
                const year = movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "—";

                return (
                  <Link
                    key={movie.id}
                    href={`/watch/movie/${movie.id}`}
                    onClick={() => setOpen(false)}
                  >
                    <Card className="p-0 gap-0 group overflow-hidden border-slate-800 bg-slate-900/70">
                      <div className="relative aspect-[2/3] w-full bg-slate-800">
                        {poster && (
                          <Image
                            src={poster}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <CardContent className="p-2">
                        <p className="line-clamp-1 text-xs font-medium group-hover:text-cyan-400">
                          {movie.title}
                        </p>
                        <p className="text-[11px] text-slate-400">{year}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {!hasSearched && !isLoading && (
            <p className="py-2 text-xs text-slate-500">
              Tip: Start typing a title and hit Enter or click Search.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
