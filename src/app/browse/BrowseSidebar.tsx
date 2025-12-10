// app/browse/BrowseSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/browse", label: "Popular right now" },
  { href: "/browse/upcoming", label: "Upcoming" },
  { href: "/browse/now-playing", label: "Now Playing" },
  { href: "/browse/top-rated", label: "Top rated" },
];

export default function BrowseSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block md:w-56">
      <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto space-y-8">
        <nav className="space-y-6 text-sm">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Library
            </p>

            <div className="relative pl-3">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-slate-800" />

              <ul className="space-y-1">
                {links.map((link) => {
                  const active =
                    link.href === "/browse"
                      ? pathname === "/browse"
                      : pathname.startsWith(link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={clsx(
                          "block rounded-lg px-2 py-1.5 text-slate-200 transition",
                          active
                            ? "bg-slate-800 text-cyan-400"
                            : "hover:bg-slate-800/60"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
