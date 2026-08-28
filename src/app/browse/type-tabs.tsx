"use client";

import { parseAsStringEnum, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

const typeParam = parseAsStringEnum([
  "movie",
  "tv",
] as const).withDefault("movie");

type Props = {
  type: "movie" | "tv";
};

const labels: Record<Props["type"], string> = {
  movie: "Movies",
  tv: "TV Shows",
};

export function TypeTabs({ type }: Props) {
  const [typeState, setType] = useQueryState("type", typeParam);
  const active = typeState ?? type;

  const handleClick = (value: Props["type"]) => {
    setType(value, { shallow: false, history: "push", scroll: true });
  };

  return (
    <div className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-slate-900/70 p-1 text-[11px] sm:text-xs">
      {(Object.keys(labels) as Props["type"][]).map((value) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors sm:px-3",
            value === active
              ? "bg-cyan-500 text-slate-950"
              : "text-slate-300 hover:bg-slate-800"
          )}
        >
          {labels[value]}
        </button>
      ))}
    </div>
  );
}
