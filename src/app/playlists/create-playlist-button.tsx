"use client";

import { useState } from "react";
import { CreatePlaylistModal } from "@/app/playlists/create-playlist-modal";
import { createPlaylistAction } from "./actions";

export function CreatePlaylistButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)]"
      >
        + Create Playlist
      </button>

      <CreatePlaylistModal
        open={open}
        onClose={() => setOpen(false)}
        action={createPlaylistAction}
      />
    </>
  );
}
