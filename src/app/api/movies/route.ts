import { NextResponse, NextRequest } from "next/server";
import { getMedia } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "popular";
    const type = (searchParams.get("type") as "movie" | "tv") || "movie";
    const media = await getMedia({ type, page, sort: sort as "popular" | "top_rated" | "upcoming" | "on_the_air" });
    return NextResponse.json(media);
}
