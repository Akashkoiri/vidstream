import { NextResponse } from "next/server";
import { getNowPlayingMovies } from "@/lib/tmdb";

export async function GET() {
  const movies = await getNowPlayingMovies();
  return NextResponse.json(movies);
}
