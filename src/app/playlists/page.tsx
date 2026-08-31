// src/app/playlists/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { getMovieById, getTvShowById, type TmdbMedia } from "@/lib/tmdb";
import { deletePlaylistAction, removePlaylistItemAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { MovieCard } from "@/components/movie-card";
import { CreatePlaylistButton } from "./create-playlist-button";
import { headers } from "next/headers";
import { DeleteButton, SubmitButton } from "./delete-button";
import { RefreshPlaylistsButton } from "./refresh-playlists-button";
import { CarouselScroller } from "./carousel-scroller";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic"; // optional

export default async function PlaylistsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  const userPlaylists = await db.query.playlists.findMany({
    where: (pl, { eq }) => eq(pl.userId, userId),
    orderBy: (pl, { desc }) => desc(pl.createdAt),
    with: {
      items: {
        orderBy: (item, { asc }) => asc(item.position),
      },
    },
  });

  // Fetch TMDB details for each item
  const playlistsWithMovies = await Promise.all(
    userPlaylists.map(async (pl) => {
      const itemsWithMovie = await Promise.all(
        pl.items.map(async (item) => {
          try {
            let media: TmdbMedia | null = null;
            if (item.mediaType === "movie") {
              media = await getMovieById(item.tmdbId) as TmdbMedia;
              media.media_type = "movie";
            } else if (item.mediaType === "tv") {
              media = await getTvShowById(item.tmdbId) as TmdbMedia;
              media.media_type = "tv";
            }
            return { item, movie: media };
          } catch {
            return { item, movie: null as TmdbMedia | null };
          }
        })
      );

      return { ...pl, itemsWithMovie };
    })
  );

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-10 px-4 pt-24 pb-12 sm:px-6 sm:pt-28 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Your Playlists
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Curate your favorite movies and shows</p>
        </div>
        <div className="flex items-center gap-3">
          <RefreshPlaylistsButton />
          <CreatePlaylistButton />
        </div>
      </div>

      {playlistsWithMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 px-6 py-24 text-center">
          <div className="rounded-full bg-zinc-900/80 p-4 mb-4 ring-1 ring-white/10">
            <svg
              className="h-8 w-8 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-200">No playlists found</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-sm">
            You don&apos;t have any playlists yet. Create one and start adding your favorite content.
          </p>
        </div>
      )}

      <div className="space-y-12">
        {playlistsWithMovies.map((pl) => (
          <div key={pl.id} className="group/playlist flex flex-col gap-4">
            {/* Playlist header */}
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 group-hover/playlist:text-white transition-colors">
                  {pl.title}
                </h2>
                {pl.description && (
                  <p className="text-sm text-zinc-400 mt-1">{pl.description}</p>
                )}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center justify-center p-2 rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="border-white/10 bg-zinc-950 text-zinc-50 sm:max-w-md shadow-2xl">
                  <DialogHeader>
                    <DialogTitle>Delete Playlist</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Are you sure you want to delete <span className="font-semibold text-white">{pl.title}</span>? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline" className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/10 hover:text-white">
                        Cancel
                      </Button>
                    </DialogClose>
                    <form action={deletePlaylistAction}>
                      <input type="hidden" name="playlistId" value={pl.id} />
                      <SubmitButton variant="destructive" text="Delete Playlist" />
                    </form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Playlist items rendered with MovieCard */}
            <div className="relative">
              {pl.itemsWithMovie.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-8 text-center backdrop-blur-sm">
                  <p className="text-sm text-zinc-500">
                    No items in this playlist yet. Browse and add some!
                  </p>
                </div>
              ) : (
                <CarouselScroller>
                  {pl.itemsWithMovie.map(({ item, movie }) => {
                    if (!movie) {
                      return (
                        <div
                          key={item.id}
                          className="relative flex-none w-[160px] sm:w-[200px] md:w-[240px] rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-xs text-zinc-400 snap-start shrink-0 flex flex-col items-center justify-center min-h-[240px]"
                        >
                          <p>Data unavailable.</p>
                          <RemovePlaylistButton itemId={item.id} />
                        </div>
                      );
                    }

                    return (
                      <div key={item.id} className="relative flex-none w-[160px] sm:w-[200px] md:w-[240px] snap-start shrink-0 transition-transform duration-300 hover:z-10 hover:-translate-y-2">
                        {/* Remove button overlay */}
                        <div className="absolute right-2 top-2 z-20 opacity-0 transition-opacity duration-300 hover:!opacity-100 focus-within:opacity-100 group-hover/carousel:[&:hover]:opacity-100 [&:hover]:opacity-100">
                           <RemovePlaylistButton itemId={item.id} />
                        </div>
                        
                        {/* Reuse the SAME card as browse page */}
                        <MovieCard
                          movie={movie}
                          showAddToPlaylistButton={false}
                        />
                      </div>
                    );
                  })}
                </CarouselScroller>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Small server component wrapper for the Remove button,
 * so we don’t repeat the form markup.
 */
function RemovePlaylistButton({ itemId }: { itemId: string }) {
  return (
    <form
      action={removePlaylistItemAction}
      className="absolute right-1 top-1 z-20"
    >
      <input type="hidden" name="itemId" value={itemId} />
      <DeleteButton />
    </form>
  );
}
