"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Bookmark } from "lucide-react";
import { usePlaylistModal } from "@/components/playlist-modal-provider";
import { useRouter } from "next/navigation";

export function AddToPlaylistButton({ movieId, mediaType = "movie" }: { movieId: number; mediaType?: "movie" | "tv" }) {
  const router = useRouter();
  const { data: session } = authClient.useSession(); // note: .session.useSession()
  const { open } = usePlaylistModal();
  const [loggingIn, setLoggingIn] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/auth/login");
      return;
    }

    open(movieId, mediaType);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loggingIn}
      className="rounded bg-black/70 p-1 text-white backdrop-blur hover:bg-black/90"
    >
      <Bookmark className="h-4 w-4" />
    </button>
  );
}
