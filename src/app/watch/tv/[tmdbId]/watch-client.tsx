// app/watch/movie/[tmdbId]/watch-client.tsx
"use client";

type WatchClientProps = {
  src: string;
  userId?: string;
  tmdbId?: string;
};

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WatchClient({ src, userId, tmdbId }: WatchClientProps) {
  const router = useRouter();
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
    <div className="relative mx-auto flex w-full flex-1 items-center justify-center p-4 sm:p-6">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <div 
        className="relative w-full aspect-video overflow-hidden rounded-xl sm:rounded-2xl bg-black shadow-2xl"
        style={{ 
          maxHeight: 'calc(100vh - 8rem)', 
          maxWidth: 'calc((100vh - 8rem) * 16 / 9)' 
        }}
      >
        <iframe
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
