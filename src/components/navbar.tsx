"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { SearchDialog } from "@/app/browse/search-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

// Extracted NavLinks component
function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <>
      <Link
        href="/browse"
        className="text-sm text-slate-200 hover:text-cyan-400"
        onClick={onLinkClick}
      >
        Browse
      </Link>
      <Link
        href="/playlists"
        className="text-sm text-slate-200 hover:text-cyan-400"
        onClick={onLinkClick}
      >
        Playlists
      </Link>
    </>
  );
}

// Extracted AuthButtons component
function AuthButtons({
  user,
  isPending,
  onLinkClick,
}: {
  user: unknown;
  isPending: boolean;
  onLinkClick?: () => void;
}) {
  if (isPending) return null;

  if (user) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await authClient.signOut();
          location.reload();
        }}
        className="w-full sm:w-auto"
      >
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          Logout
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Link href="/auth/login" onClick={onLinkClick}>
        <Button size="sm" className="w-full sm:w-auto">
          Sign in
        </Button>
      </Link>
      <Link href="/auth/register" onClick={onLinkClick}>
        <Button
          size="sm"
          className="w-full bg-cyan-500 px-4 text-slate-950 hover:bg-cyan-400 sm:w-auto"
        >
          Get started
        </Button>
      </Link>
    </div>
  );
}

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;
  const [isOpen, setIsOpen] = useState(false);

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

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 md:flex">
          <NavLinks />
          <div className="h-5 w-px bg-slate-700/80" />
          <SearchDialog />
          <AuthButtons user={user} isPending={isPending} />
        </nav>

        {/* Mobile Nav */}
        <div className="flex items-center gap-4 md:hidden">
          <SearchDialog />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-200 hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-slate-800 bg-slate-950 text-slate-100"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-slate-100">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <NavLinks onLinkClick={() => setIsOpen(false)} />
                </div>
                <div className="h-px w-full bg-slate-800" />
                <AuthButtons
                  user={user}
                  isPending={isPending}
                  onLinkClick={() => setIsOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
