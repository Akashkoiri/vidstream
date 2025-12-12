// src/app/api/playlists/[playlistId]/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addItemToPlaylist } from "@/data/playlists";

type Context = {
  params: Promise<{
    playlistId: string;
  }>;
};

export async function POST(req: NextRequest, context: Context) {
  try {
    const { playlistId } = await context.params;

    const body = await req.json();
    const { tmdbId, mediaType } = body as {
      tmdbId?: string | number;
      mediaType?: "movie" | "tv";
    };

    if (!tmdbId || !mediaType) {
      return NextResponse.json(
        { error: "tmdbId and mediaType are required" },
        { status: 400 }
      );
    }

    const item = await addItemToPlaylist({
      playlistId,
      tmdbId: String(tmdbId),
      mediaType,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error adding item to playlist";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
