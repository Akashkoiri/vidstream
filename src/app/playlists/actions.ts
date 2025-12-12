// src/app/playlists/actions.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { playlists, playlistItems } from "@/db/app-schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// ADD THIS TO ACTIONS FILE
export async function createPlaylistAction(formData: FormData): Promise<void> {
  const userId = await getUserIdOrThrow();

  const titleVal = formData.get("title");
  const descVal = formData.get("description");

  if (typeof titleVal !== "string" || titleVal.trim().length === 0) {
    throw new Error("Title is required");
  }

  const title = titleVal.trim();
  const description =
    typeof descVal === "string" && descVal.trim().length > 0
      ? descVal.trim()
      : null;

  await db.insert(playlists).values({
    userId,
    title,
    description,
  });

  revalidatePath("/playlists");
}

async function getUserIdOrThrow(): Promise<string> {
  // `headers()` is sync, no need to await
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function deletePlaylistAction(formData: FormData): Promise<void> {
  const userId = await getUserIdOrThrow();

  const playlistIdValue = formData.get("playlistId");
  if (typeof playlistIdValue !== "string" || playlistIdValue.length === 0) {
    throw new Error("playlistId is required");
  }
  const playlistId = playlistIdValue;

  // ensure playlist belongs to user
  const playlist = await db.query.playlists.findFirst({
    where: (pl, { and, eq }) =>
      and(eq(pl.id, playlistId), eq(pl.userId, userId)),
  });

  if (!playlist) {
    throw new Error("Playlist not found or not yours");
  }

  await db
    .delete(playlists)
    .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)));

  revalidatePath("/playlists");
}

export async function removePlaylistItemAction(
  formData: FormData
): Promise<void> {
  const userId = await getUserIdOrThrow();

  const itemIdValue = formData.get("itemId");
  if (typeof itemIdValue !== "string" || itemIdValue.length === 0) {
    throw new Error("itemId is required");
  }
  const itemId = itemIdValue;

  // ensure item belongs to user's playlist
  const item = await db.query.playlistItems.findFirst({
    where: (it, { eq }) => eq(it.id, itemId),
    with: {
      playlist: true, // typed because of playlistItemsRelations
    },
  });

  if (!item || item.playlist.userId !== userId) {
    throw new Error("Item not found or not yours");
  }

  await db.delete(playlistItems).where(eq(playlistItems.id, itemId));

  revalidatePath("/playlists");
}
