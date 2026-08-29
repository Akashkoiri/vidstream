// app/watch/tv/[tmdbId]/watch-client.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";

type WatchClientProps = {
  tmdbId: string;
  userId?: string;
  startSeconds?: number;
};

const PROVIDERS = [
  {
    name: "VidSrc2",
    url: (id: string, start: number) => {
      const url = new URL(`https://vidsrc2.ru/embed/tv/${id}`);
      url.searchParams.set("autoplay", "1");
      url.searchParams.set("autonext", "1");
      if (start > 0) url.searchParams.set("startAt", String(start));
      return url.toString();
    },
  },
  {
    name: "CineSrc",
    url: (id: string) => `https://cinesrc.st/embed/tv/${id}`,
  },
  {
    name: "VidLink",
    url: (id: string) => `https://vidlink.pro/tv/${id}`,
  },
  {
    name: "2Embed",
    url: (id: string) => `https://www.2embed.cc/embedtv/${id}`,
  },
  {
    name: "Filmu",
    url: (id: string) => `https://embed.filmu.in/tv/${id}`,
  },
];

export default function WatchClient({ tmdbId, userId, startSeconds = 0 }: WatchClientProps) {
  const router = useRouter();
  const [providerIdx, setProviderIdx] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedProvider = PROVIDERS[providerIdx];
  const src = selectedProvider.url(tmdbId, startSeconds);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (!dropdownOpen) {
        hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
      }
    };

    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "PLAYER_EVENT") return;

      const { player_info, player_status, player_progress, player_duration } =
        event.data.data;

      // The player sends 'playing' events every ~5s
      if (
        player_status === "playing" ||
        player_status === "paused" ||
        player_status === "completed"
      ) {
        if (!userId || !tmdbId) return;

        fetch("/api/watch/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            tmdbId,
            mediaType: player_info.mediaType || "tv",
            season: player_info.season ? parseInt(player_info.season) : null,
            episode: player_info.episode ? parseInt(player_info.episode) : null,
            currentTime: Math.floor(player_progress),
            duration: Math.floor(player_duration),
            progressPercent: player_duration
              ? Math.floor((player_progress / player_duration) * 100)
              : 0,
          }),
        }).catch(console.error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [userId, tmdbId]);

  return (
    <div className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center ${!showControls ? 'cursor-none' : ''}`}>
      {/* Invisible hover zone at the top to reveal controls */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 z-40"
        onMouseMove={() => {
          setShowControls(true);
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          if (!dropdownOpen) {
            hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
          }
        }}
      />
      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-end gap-4 w-full">
          <div className="relative flex items-center gap-3 pointer-events-auto" ref={dropdownRef}>
          <div className="relative">
            <Button
              variant="secondary"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="gap-2 rounded-full px-4 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-black/80 text-white"
            >
              <MonitorPlay className="w-4 h-4 text-white" />
              <span className="font-semibold">{selectedProvider.name}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-black/95 backdrop-blur-md p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col gap-1">
                  {PROVIDERS.map((p, idx) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        setProviderIdx(idx);
                        setDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors ${
                        idx === providerIdx
                          ? "bg-white text-black font-semibold shadow-sm"
                          : "text-zinc-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {p.name}
                      {idx === providerIdx && (
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      <div className="relative w-full h-full flex-1 bg-black overflow-hidden">
        <iframe
          key={src}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
