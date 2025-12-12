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
  open: (movieId: number) => void;
  close: () => void;
};

const PlaylistModalContext = createContext<PlaylistModalContextValue | null>(
  null
);

export function PlaylistModalProvider({ children }: { children: ReactNode }) {
  const [movieId, setMovieId] = useState<number | null>(null);

  const open = useCallback((id: number) => {
    setMovieId(id);
  }, []);

  const close = useCallback(() => {
    setMovieId(null);
  }, []);

  return (
    <PlaylistModalContext.Provider value={{ open, close }}>
      {children}

      {movieId !== null && <PlaylistModal movieId={movieId} onClose={close} />}
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
