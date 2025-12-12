"use client";

import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";

type Playlist = {
  id: string;
  title: string;
};

type PlaylistsResponse = {
  playlists: Playlist[];
};

export function PlaylistModal({
  movieId,
  onClose,
}: {
  movieId: number;
  onClose: () => void;
}) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoadingPlaylists(true);

        const res = await fetch("/api/playlists");
        if (!res.ok) throw new Error("Failed to load playlists");

        const data = (await res.json()) as PlaylistsResponse;
        setPlaylists(data.playlists ?? []);
      } catch (err) {
        setError("Could not load playlists. Please try again.");
      } finally {
        setLoadingPlaylists(false);
      }
    };

    void load();
  }, []);

  async function add(playlistId: string) {
    try {
      setAdding(true);
      setError(null);

      const res = await fetch(`/api/playlists/${playlistId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: movieId,
          mediaType: "movie",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add to playlist");
      }

      onClose();
    } catch (err) {
      setError("Could not add to playlist. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              Add to Playlist
            </h2>
            <p className="text-xs text-slate-400">
              Choose a playlist to save this movie.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          {loadingPlaylists ? (
            <div className="space-y-2">
              <div className="h-9 w-full animate-pulse rounded-md bg-slate-800" />
              <div className="h-9 w-full animate-pulse rounded-md bg-slate-800" />
              <div className="h-9 w-2/3 animate-pulse rounded-md bg-slate-800" />
            </div>
          ) : playlists.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/60 px-4 py-6 text-center text-sm text-slate-400">
              You don&apos;t have any playlists yet.
              <br />
              <span className="text-xs text-slate-500">
                Create one from the Playlists page.
              </span>
            </div>
          ) : (
            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {playlists.map((p) => (
                <button
                  key={p.id}
                  disabled={adding}
                  onClick={() => add(p.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-100 transition hover:border-cyan-500/70 hover:bg-slate-800"
                >
                  <span className="truncate">{p.title}</span>
                  <span className="text-[10px] text-cyan-400">
                    {adding ? <Spinner /> : <PlusIcon />}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-transparent py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
