// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb"; // add this function if not already

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") ?? "";
  const pageParam = searchParams.get("page") ?? "1";
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;

  if (!query.trim()) {
    return NextResponse.json({ movies: [], totalPages: 0 });
  }

  try {
    const { movies, totalPages } = await searchMovies({ query, page });
    return NextResponse.json({ movies, totalPages });
  } catch (error) {
    console.error("TMDB search error:", error);
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
}
