"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function Navbar() {
  const [user, setUser] = useState<unknown | null>(null);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            ▶
          </span>
          <span className="font-semibold tracking-tight">VidStream</span>
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await authClient.signOut();
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
