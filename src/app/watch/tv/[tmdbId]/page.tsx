import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { watchProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import WatchClient from "./watch-client";
import { headers } from "next/headers";
import { RectangleAd } from "@/components/RectangleAd";

type Props = { params: Promise<{ tmdbId: string }> };

export default async function WatchPage({ params }: Props) {
  const { tmdbId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id as string | undefined;

  let startSeconds = 0;
  let season = 1;
  let episode = 1;
  if (userId) {
    const [progress] = await db
      .select()
      .from(watchProgress)
      .where(
        and(eq(watchProgress.userId, userId), eq(watchProgress.tmdbId, tmdbId))
      )
      .limit(1);
    startSeconds = progress?.currentTime ?? 0;
    season = progress?.season ?? 1;
    episode = progress?.episode ?? 1;
  }

  return (
    <div className="flex w-full flex-1 flex-col relative z-10">
      <WatchClient
        tmdbId={tmdbId}
        userId={userId}
        startSeconds={startSeconds}
        season={season}
        episode={episode}
      />
    </div>
  );
}
