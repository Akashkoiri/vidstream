"use client";

import { parseAsStringEnum, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

const sortParam = parseAsStringEnum([
  "popular",
  "top_rated",
  "upcoming",
] as const).withDefault("popular");

type Props = {
  sort: "popular" | "top_rated" | "upcoming";
};

const labels: Record<Props["sort"], string> = {
  popular: "Popular",
  top_rated: "Top rated",
  upcoming: "Upcoming",
};

export function SortTabs({ sort }: Props) {
  const [sortState, setSort] = useQueryState("sort", sortParam);
  const active = sortState ?? sort;

  const handleClick = (value: Props["sort"]) => {
    setSort(value, { shallow: false, history: "push", scroll: true });
  };

  return (
    <div className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-slate-900/70 p-1 text-[11px] sm:text-xs">
      {(Object.keys(labels) as Props["sort"][]).map((value) => (
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
