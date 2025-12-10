import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-4 pb-16 pt-10 md:px-8 md:pt-16">
        {/* Hero */}
        <section className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          {/* Left */}
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/80">
              Streaming reinvented
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              Watch movies & series in a cinematic, distraction-free experience.
            </h1>
            <p className="max-w-xl text-balance text-sm text-slate-300 sm:text-base">
              Build your own watchlist, resume across devices, and explore a
              beautiful catalog powered by your custom streaming backend.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/browse">
                <Button className="h-11 rounded-full bg-cyan-500 px-6 text-slate-950 hover:bg-cyan-400">
                  Start watching
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-slate-600 bg-slate-900/40 px-6 text-slate-100 hover:bg-slate-800"
                >
                  Create free account
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] text-emerald-400">
                  ✓
                </span>
                No ads, fully custom
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/15 text-[10px] text-cyan-400">
                  ✓
                </span>
                Built with Next.js & Neon
              </div>
            </div>
          </div>

          {/* Right – preview mockup */}
          <div className="relative">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 shadow-[0_0_80px_rgba(0,0,0,0.7)]">
              {/* Fake hero artwork */}
              <div className="relative h-44 w-full bg-linear-to-tr from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#22d3ee33,_transparent_55%),radial-gradient(circle_at_bottom,_#e879f933,_transparent_55%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_transparent_0,_#02061788_40%,_#020617ff_70%)]" />
                <div className="absolute bottom-4 left-4 space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                    Now streaming
                  </p>
                  <p className="text-lg font-semibold">
                    The VidStream Original
                  </p>
                  <p className="text-xs text-slate-300">
                    Sci-Fi • 2h 14m • 4K HDR
                  </p>
                </div>
              </div>

              {/* Controls bar */}
              <div className="space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-800/80" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Continue watching</p>
                      <p className="text-xs text-slate-400">
                        Episode 3 · 28:12 / 44:00
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    className="h-9 w-9 rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  >
                    ▶
                  </Button>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-2/3 rounded-full bg-cyan-500" />
                </div>

                <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-900/80 p-3">
                    <p className="font-medium">Profiles</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Separate spaces for everyone in the house.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 p-3">
                    <p className="font-medium">Smart resume</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Pick up on any device from the exact second.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 p-3">
                    <p className="font-medium">Watchlists</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Curate your favorites with one click.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature strip / categories preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-slate-200">
              Preview the experience
            </h2>
            <Link
              href="/browse"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
            >
              View catalog →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Trending now", "Top rated", "Sci-Fi & Fantasy"].map((title) => (
              <div
                key={title}
                className="space-y-2 rounded-3xl border border-slate-800 bg-slate-950/70 p-3"
              >
                <p className="text-xs font-medium text-slate-200">{title}</p>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-2/3 flex-1 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
