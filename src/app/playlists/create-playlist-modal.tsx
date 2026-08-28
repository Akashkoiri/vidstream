"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await action(formData);
    setLoading(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new playlist to organize your favorite movies and shows.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Playlist Title"
            className="w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 transition-all"
            required
          />

          <textarea
            name="description"
            placeholder="Description (optional)"
            className="w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 transition-all"
            rows={2}
          />

          <DialogFooter className="mt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
