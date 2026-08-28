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
  const userId = session?.user?.id as string | undefined;

  let startSeconds = 0;
  if (userId) {
    const [progress] = await db
      .select()
      .from(watchProgress)
      .where(
        and(eq(watchProgress.userId, userId), eq(watchProgress.tmdbId, tmdbId))
      )
      .limit(1);
    startSeconds = progress?.currentTime ?? 0;
  }


  const embedUrl = new URL(`https://vidsrc2.ru/embed/tv/${tmdbId}`);
  embedUrl.searchParams.set("autoplay", "1");
  embedUrl.searchParams.set("autonext", "1");
  if (startSeconds > 0)
    embedUrl.searchParams.set("startAt", String(startSeconds));

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="flex w-full flex-1 flex-col">
        <WatchClient
          src={embedUrl.toString()}
          userId={userId}
          tmdbId={tmdbId}
        />
      </div>
    </div>
  );
}
