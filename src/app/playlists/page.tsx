// src/app/playlists/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { getMovieById, type TmdbMovie } from "@/lib/tmdb";
import { deletePlaylistAction, removePlaylistItemAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { MovieCard } from "@/components/movie-card";
import { CreatePlaylistButton } from "./create-playlist-button";
import { headers } from "next/headers";
import { DeleteButton } from "./delete-button";
import { RefreshPlaylistsButton } from "./refresh-playlists-button";

export const dynamic = "force-dynamic"; // optional

export default async function PlaylistsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/login"); // adjust to your auth route
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
          if (item.mediaType !== "movie") {
            return { item, movie: null as TmdbMovie | null };
          }

          try {
            const movie = await getMovieById(item.tmdbId);
            // `getMovieById` should already return something compatible with TmdbMovie
            return { item, movie: movie as TmdbMovie };
          } catch {
            return { item, movie: null as TmdbMovie | null };
          }
        })
      );

      return { ...pl, itemsWithMovie };
    })
  );

  return (
    <div className="mx-auto space-y-6 px-6 py-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-50">Your Playlists</h1>
        <div className="flex items-center gap-2">
          <RefreshPlaylistsButton />
          <CreatePlaylistButton />
        </div>
      </div>

      {playlistsWithMovies.length === 0 && (
        <p className="text-sm text-slate-400">
          You don&apos;t have any playlists yet. Create one and start adding
          movies.
        </p>
      )}

      <div className="space-y-4 mt-4">
        {playlistsWithMovies.map((pl) => (
          <Card key={pl.id} className="border-slate-800 bg-slate-900/70 p-0">
            {/* Playlist header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-50">
                  {pl.title}
                </h2>
                {pl.description && (
                  <p className="text-xs text-slate-400">{pl.description}</p>
                )}
              </div>

              <form action={deletePlaylistAction}>
                <input type="hidden" name="playlistId" value={pl.id} />
                <button
                  type="submit"
                  className="rounded bg-red-500/10 px-3 py-1 text-xs text-red-400 hover:bg-red-500/20"
                >
                  Delete playlist
                </button>
              </form>
            </div>

            {/* Playlist items rendered with MovieCard */}
            <CardContent className="space-y-3 px-4 py-3">
              {pl.itemsWithMovie.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No items in this playlist yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 md:grid-cols-6">
                  {pl.itemsWithMovie.map(({ item, movie }) => {
                    if (!movie) {
                      return (
                        <div
                          key={item.id}
                          className="relative rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-400"
                        >
                          <p>Movie data unavailable.</p>
                          <RemovePlaylistButton itemId={item.id} />
                        </div>
                      );
                    }

                    return (
                      <div key={item.id} className="relative">
                        {/* Remove button overlay */}
                        <RemovePlaylistButton itemId={item.id} />
                        {/* Reuse the SAME card as browse page */}
                        <MovieCard
                          movie={movie}
                          showAddToPlaylistButton={false}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
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
