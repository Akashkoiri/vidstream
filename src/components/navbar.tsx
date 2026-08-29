"use client";

import Link from "next/link";
import { Menu, User, LogOut, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { SearchDialog } from "@/app/browse/search-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// Extracted NavLinks component
function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <>
      <Link
        href="/"
        className="text-sm font-semibold text-zinc-100 drop-shadow-md hover:text-white transition-colors"
        onClick={onLinkClick}
      >
        Home
      </Link>
      <Link
        href="/browse"
        className="text-sm font-semibold text-zinc-100 drop-shadow-md hover:text-white transition-colors"
        onClick={onLinkClick}
      >
        Browse
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/60 backdrop-blur-sm text-zinc-100 hover:bg-black/80 hover:text-white border border-zinc-700 drop-shadow-md"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-zinc-800 text-zinc-200">
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
            <Link href="/playlists" onClick={onLinkClick} className="flex items-center w-full">
              <ListVideo className="mr-2 h-4 w-4" />
              <span>Playlists</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem
            className="cursor-pointer text-red-400 hover:bg-zinc-800 hover:text-red-300 focus:bg-zinc-800 focus:text-red-300"
            onClick={async () => {
              if (onLinkClick) onLinkClick();
              await authClient.signOut();
              location.reload();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
          className="w-full px-4 sm:w-auto"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  );
}

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const isSolid = !isHomePage || scrolled;

  if (pathname.startsWith("/watch")) return null;

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-40 transition-colors duration-300 border-b",
        isSolid 
          ? "bg-black/80 backdrop-blur border-zinc-800" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-3">
        {/* Custom Logo from Reference */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <img src="/logo.svg" alt="VidStream Logo" width={32} height={32} className="transition-transform duration-500 group-hover:scale-105" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-sm transition-all duration-500 group-hover:text-zinc-300">
            VidStream
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 md:flex">
          <NavLinks />
          <div className="h-5 w-px bg-zinc-700/80" />
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
                className="text-zinc-200 hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-zinc-800 bg-black text-zinc-100"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-zinc-100">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <NavLinks onLinkClick={() => setIsOpen(false)} />
                </div>
                <div className="h-px w-full bg-zinc-800" />
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
