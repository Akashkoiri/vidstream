// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchMedia } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") ?? "";
  const pageParam = searchParams.get("page") ?? "1";
  const page = Number(pageParam) > 0 ? Number(pageParam) : 1;

  if (!query.trim()) {
    return NextResponse.json({ results: [], totalPages: 0 });
  }

  try {
    const { results, totalPages } = await searchMedia({ query, page });
    return NextResponse.json({ results, totalPages });
  } catch (error) {
    console.error("TMDB search error:", error);
    return NextResponse.json(
      { error: "Failed to search media" },
      { status: 500 }
    );
  }
}
