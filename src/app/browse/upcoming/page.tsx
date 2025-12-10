// app/browse/upcoming/page.tsx
import { UpcomingGrid } from "./upcoming-grid";

export default async function UpcomingPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const raw = (await searchParams)?.page;
  const page = Number.parseInt(raw ?? "1", 10) || 1;

  return <UpcomingGrid page={page} />;
}
