import { NextResponse, NextRequest } from "next/server";
import { getMovies } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "popular";
    const movies = await getMovies({ page, sort: sort as "popular" | "top_rated" | "upcoming" });
    return NextResponse.json(movies);
}
