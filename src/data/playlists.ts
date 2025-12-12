// src/data/playlists.ts
"use server";

import { db } from "@/db"; // adjust path
import { playlists, playlistItems } from "@/db/app-schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth"; // e.g. Better Auth
import { headers } from "next/headers";

async function getCurrentUserId() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

// Create a playlist
export async function createPlaylist(input: {
  title: string;
  description?: string;
}) {
  const userId = await getCurrentUserId();

  const [playlist] = await db
    .insert(playlists)
    .values({
      userId,
      title: input.title,
      description: input.description,
    })
    .returning();

  return playlist;
}

// Get user's playlists (+ optional item count)
export async function getUserPlaylists() {
  const userId = await getCurrentUserId();

  const rows = await db.query.playlists.findMany({
    where: (pl, { eq }) => eq(pl.userId, userId),
    orderBy: (pl, { desc }) => desc(pl.createdAt),
  });

  return rows;
}

// Add movie/tv to a playlist
export async function addItemToPlaylist(input: {
  playlistId: string;
  tmdbId: string;
  mediaType: "movie" | "tv";
}) {
  const userId = await getCurrentUserId();

  // 1. Ensure playlist belongs to user
  const playlist = await db.query.playlists.findFirst({
    where: (pl, { and, eq }) =>
      and(eq(pl.id, input.playlistId), eq(pl.userId, userId)),
  });

  if (!playlist) {
    throw new Error("Playlist not found or not yours");
  }

  // 2. Optional: prevent duplicates
  const existing = await db.query.playlistItems.findFirst({
    where: (item, { and, eq }) =>
      and(
        eq(item.playlistId, input.playlistId),
        eq(item.tmdbId, input.tmdbId),
        eq(item.mediaType, input.mediaType)
      ),
  });

  if (existing) {
    return existing;
  }

  // 3. Get next position
  const [maxPositionRow] = await db
    .select({ position: playlistItems.position })
    .from(playlistItems)
    .where(eq(playlistItems.playlistId, input.playlistId))
    .orderBy(desc(playlistItems.position))
    .limit(1);

  const nextPosition = (maxPositionRow?.position ?? 0) + 1;

  const [item] = await db
    .insert(playlistItems)
    .values({
      playlistId: input.playlistId,
      tmdbId: input.tmdbId,
      mediaType: input.mediaType,
      position: nextPosition,
    })
    .returning();

  return item;
}

// Get playlist with items
export async function getPlaylistWithItems(input: { playlistId: string }) {
  const userId = await getCurrentUserId();

  const playlist = await db.query.playlists.findFirst({
    where: (pl, { and, eq }) =>
      and(eq(pl.id, input.playlistId), eq(pl.userId, userId)),
    with: {
      items: {
        orderBy: (item, { asc }) => asc(item.position),
      },
    },
  });

  if (!playlist) {
    throw new Error("Playlist not found or not yours");
  }

  return playlist;
}
