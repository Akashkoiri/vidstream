"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { SearchDialog } from "@/app/browse/search-dialog";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            ▶
          </span>
          <span className="font-semibold tracking-tight">VidStream</span>
        </Link>

        {/* Right side controls */}
        <nav className="flex items-center gap-3">
          <div className="flex gap-5">
            <Link
              href="/browse"
              className="text-sm text-slate-200 hover:text-cyan-400"
            >
              Browse
            </Link>
            <Link
              href="/playlists"
              className="text-sm text-slate-200 hover:text-cyan-400"
            >
              Playlists
            </Link>
          </div>

          <div className="h-5 w-px bg-slate-700/80" />

          {/* 🔍 Search Icon Modal Trigger */}
          <SearchDialog />

          {/* While session is loading, optionally show nothing or a skeleton */}
          {isPending ? null : user ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await authClient.signOut();
                // optional: router.refresh() instead of full reload
                location.reload();
              }}
            >
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </form>
          ) : (
            <>
              <Link href="/auth/login">
                <Button size="sm">Sign in</Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="bg-cyan-500 px-4 text-slate-950 hover:bg-cyan-400"
                >
                  Get started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
