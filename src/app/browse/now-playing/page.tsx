// app/browse/now-playing/page.tsx
import { NowPlayingGrid } from "./now-playing-grid";

export default async function NowPlayingPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const raw = (await searchParams)?.page;
  const page = Number.parseInt(raw ?? "1", 10) || 1;

  return <NowPlayingGrid page={page} />;
}
