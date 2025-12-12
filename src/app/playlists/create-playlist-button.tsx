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
        className="rounded bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-700"
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
