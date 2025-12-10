// app/browse/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      {/* Skeleton hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 p-8">
        <div className="space-y-3">
          <div className="h-3 w-32 rounded-full bg-slate-800/70" />
          <div className="h-7 w-64 rounded-full bg-slate-800/70" />
          <div className="h-3 w-80 max-w-full rounded-full bg-slate-800/70" />
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      </section>

      {/* Spinner + skeleton grid */}
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <span>Loading titles…</span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70"
          >
            <div className="aspect-2/3 w-full bg-slate-800/80 animate-pulse" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-3/4 rounded-full bg-slate-800/90" />
              <div className="h-2 w-1/2 rounded-full bg-slate-800/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
