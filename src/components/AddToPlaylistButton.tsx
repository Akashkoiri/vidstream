"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Bookmark } from "lucide-react";
import { usePlaylistModal } from "@/components/playlist-modal-provider";

export function AddToPlaylistButton({ movieId }: { movieId: number }) {
  const { data: session } = authClient.useSession(); // note: .session.useSession()
  const { open } = usePlaylistModal();
  const [loggingIn, setLoggingIn] = useState(false);

  async function handleClick() {
    if (!session) {
      setLoggingIn(true);
      await authClient.signIn.social({ provider: "github" });
      setLoggingIn(false);
      return;
    }

    open(movieId);
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
