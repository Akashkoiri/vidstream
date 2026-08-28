"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { PlaylistModal } from "@/components/playlist-modal";

type PlaylistModalContextValue = {
  open: (movieId: number, mediaType?: "movie" | "tv") => void;
  close: () => void;
};

const PlaylistModalContext = createContext<PlaylistModalContextValue | null>(
  null
);

export function PlaylistModalProvider({ children }: { children: ReactNode }) {
  const [movieId, setMovieId] = useState<number | null>(null);
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");

  const open = useCallback((id: number, type: "movie" | "tv" = "movie") => {
    setMovieId(id);
    setMediaType(type);
  }, []);

  const close = useCallback(() => {
    setMovieId(null);
  }, []);

  return (
    <PlaylistModalContext.Provider value={{ open, close }}>
      {children}

      {movieId !== null && <PlaylistModal movieId={movieId} mediaType={mediaType} onClose={close} />}
    </PlaylistModalContext.Provider>
  );
}

export function usePlaylistModal() {
  const ctx = useContext(PlaylistModalContext);
  if (!ctx) {
    throw new Error(
      "usePlaylistModal must be used within PlaylistModalProvider"
    );
  }
  return ctx;
}
