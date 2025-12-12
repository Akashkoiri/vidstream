"use client";

import { useState } from "react";

export function CreatePlaylistModal({
  open,
  onClose,
  action,
}: {
  open: boolean;
  onClose: () => void;
  action: (formData: FormData) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await action(formData);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-xl bg-neutral-900 p-5 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Create Playlist
        </h2>

        <form action={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Playlist Title"
            className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500"
            required
          />

          <textarea
            name="description"
            placeholder="Description (optional)"
            className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500"
            rows={2}
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-3 py-1 text-sm text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded bg-cyan-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-cyan-700"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
