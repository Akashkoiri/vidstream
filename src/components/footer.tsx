"use client";

import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/watch") || pathname.startsWith("/auth")) return null;

  return (
    <footer className="w-full border-t border-white/5 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand & Description */}
          <div className="flex flex-col items-center md:items-start gap-2 max-w-xs">
            <Link href="/" className="group">
              <span className="font-extrabold text-xl tracking-tight text-white transition-colors duration-500 group-hover:text-zinc-300">
                VidStream
              </span>
            </Link>
            <p className="text-sm text-zinc-400 text-center md:text-left">
              Your ultimate destination for endless entertainment. Stream movies and TV shows in cinematic quality.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </nav>

          {/* Socials */}
          <div className="flex gap-4 text-zinc-500">
            <a href="https://twitter.com/Akashkoiri12" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://github.com/Akashkoiri" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/ak45.h?igsi=MWdlcmZldWs4dmY0Yw==" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} VidStream, Inc. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Designed for the cinematic experience.
          </p>
        </div>
      </div>
    </footer>
  );
}
