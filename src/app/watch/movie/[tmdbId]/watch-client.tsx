// app/watch/movie/[tmdbId]/watch-client.tsx
"use client";

type WatchClientProps = {
  src: string;
  userId?: string;
  tmdbId?: string;
};

export default function WatchClient({ src }: WatchClientProps) {
  return (
    <div className="w-full">
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-800 bg-black shadow-xl">
        <iframe
          src={src}
          className="absolute inset-0 h-full w-full rounded-3xl"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts allow-fullscreen"
        />
      </div>
    </div>
  );
}
