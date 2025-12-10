// app/browse/top-rated/page.tsx
import { TopRatedGrid } from "./top-rated-grid";

export default async function TopRatedPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const raw = (await searchParams)?.page;
  const page = Number.parseInt(raw ?? "1", 10) || 1;

  return <TopRatedGrid page={page} />;
}
