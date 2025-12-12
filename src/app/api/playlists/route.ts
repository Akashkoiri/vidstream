// src/app/api/playlists/route.ts
import { NextResponse } from "next/server";
import { createPlaylist, getUserPlaylists } from "@/data/playlists";

export async function GET() {
  try {
    const playlists = await getUserPlaylists();
    return NextResponse.json({ playlists });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching playlists";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const playlist = await createPlaylist({ title, description });

    return NextResponse.json({ playlist }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error creating playlist";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
