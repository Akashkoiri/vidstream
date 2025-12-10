import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { watchProgress } from "@/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    userId,
    tmdbId,
    mediaType,
    season,
    episode,
    currentTime,
    duration,
    progressPercent,
  } = body;

  // small upsert
  await db
    .insert(watchProgress)
    .values({
      userId,
      tmdbId,
      mediaType,
      season,
      episode,
      currentTime,
      duration,
      progressPercent,
    })
    .onConflictDoUpdate({
      target: [watchProgress.userId, watchProgress.tmdbId],
      set: { currentTime, duration, progressPercent },
    });

  return NextResponse.json({ ok: true });
}
