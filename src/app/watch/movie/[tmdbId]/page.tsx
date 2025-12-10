import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { watchProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import WatchClient from "./watch-client";
import { headers } from "next/headers";

type Props = { params: Promise<{ tmdbId: string }> };

export default async function WatchPage({ params }: Props) {
  const { tmdbId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/login");

  const userId = session.user.id as string;

  const [progress] = await db
    .select()
    .from(watchProgress)
    .where(
      and(eq(watchProgress.userId, userId), eq(watchProgress.tmdbId, tmdbId))
    )
    .limit(1);

  const startSeconds = progress?.currentTime ?? 0;

  const embedUrl = new URL(`https://www.vidking.net/embed/movie/${tmdbId}`);
  embedUrl.searchParams.set("color", "e50914");
  embedUrl.searchParams.set("autoPlay", "true");
  if (startSeconds > 0)
    embedUrl.searchParams.set("progress", String(startSeconds));

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-4">
        <WatchClient
          src={embedUrl.toString()}
          userId={userId}
          tmdbId={tmdbId}
        />
      </div>
    </div>
  );
}
