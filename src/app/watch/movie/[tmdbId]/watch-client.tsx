// app/watch/movie/[tmdbId]/watch-client.tsx
"use client";

type WatchClientProps = {
  src: string;
  userId?: string;
  tmdbId?: string;
};

export default function WatchClient({ src }: WatchClientProps) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="relative w-full flex-1 overflow-hidden bg-black">
        <iframe
          src={src}
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts allow-fullscreen"
        />
      </div>
    </div>
  );
}
