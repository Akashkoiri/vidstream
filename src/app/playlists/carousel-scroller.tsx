"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CarouselScroller({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll by 80% of container width
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/scroller">
      <button
        onClick={() => scroll("left")}
        className="absolute -left-3 md:-left-5 top-[calc(50%-12px)] -translate-y-1/2 z-30 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-md hover:bg-black transition-colors shadow-2xl opacity-90 hover:opacity-100"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6 text-white transition-transform hover:-translate-x-0.5" />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-6 pt-2 px-2 snap-x snap-mandatory hide-scrollbar group/carousel scroll-smooth"
      >
        {children}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute -right-3 md:-right-5 top-[calc(50%-12px)] -translate-y-1/2 z-30 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-md hover:bg-black transition-colors shadow-2xl opacity-90 hover:opacity-100"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6 text-white transition-transform hover:translate-x-0.5" />
      </button>
    </div>
  );
}
