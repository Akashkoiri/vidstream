// app/browse/page.tsx
import { MoviesGrid } from "./movies-grid";

export default async function PopularPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const raw = (await searchParams)?.page;
  const page = Number.parseInt(raw ?? "1", 10) || 1;

  return <MoviesGrid page={page} />;
}
