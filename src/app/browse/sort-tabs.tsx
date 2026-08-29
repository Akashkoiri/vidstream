"use client";

import { useState, useRef, useEffect } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";

const sortParam = parseAsStringEnum([
  "popular",
  "top_rated",
  "upcoming",
  "trending",
  "netflix",
  "prime",
  "disney",
  "max"
] as const).withDefault("popular");

type Props = {
  sort: "popular" | "top_rated" | "upcoming" | "trending" | "netflix" | "prime" | "disney" | "max";
};

const labels: Record<Props["sort"], string> = {
  popular: "Popular",
  top_rated: "Top rated",
  upcoming: "Upcoming",
  trending: "Trending",
  netflix: "Netflix",
  prime: "Prime Video",
  disney: "Disney+",
  max: "HBO Max",
};

export function SortTabs({ sort }: Props) {
  const [sortState, setSort] = useQueryState("sort", sortParam);
  const active = sortState ?? sort;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = (value: Props["sort"]) => {
    setSort(value, { shallow: false, history: "push", scroll: true });
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-32 items-center justify-between gap-2 rounded-md bg-slate-900/70 py-1.5 pl-3.5 pr-2.5 text-[11px] font-medium text-slate-300 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-white/40 sm:text-xs cursor-pointer border border-slate-800/60"
      >
        <span className="truncate">{labels[active as Props["sort"]]}</span>
        <svg
          className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-32 origin-top-right overflow-hidden rounded-md bg-slate-900 border border-slate-800 shadow-xl shadow-black/40 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex flex-col">
            {(Object.keys(labels) as Props["sort"][]).map((value) => (
              <button
                key={value}
                onClick={() => handleClick(value)}
                className={`block w-full px-3 py-2 text-left text-[11px] sm:text-xs transition-colors ${
                  value === active
                    ? "bg-white/10 text-white font-medium"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
                }`}
              >
                {labels[value]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
