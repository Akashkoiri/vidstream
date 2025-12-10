// components/movie-pagination.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type MoviePaginationProps = {
  page: number;
  totalPages: number;
  basePath?: string;
};

export default function MoviePagination({
  page,
  totalPages,
  basePath,
}: MoviePaginationProps) {
  const pathname = usePathname();
  const base = basePath ?? pathname ?? "/";

  const safeTotal = totalPages && totalPages > 0 ? totalPages : 1;
  const current = Math.min(Math.max(page || 1, 1), safeTotal);

  const canGoPrev = current > 1;
  const canGoNext = current < safeTotal;

  const createHref = (targetPage: number) => {
    const p = Math.min(Math.max(targetPage, 1), safeTotal);
    if (p <= 1) return base;
    return `${base}?page=${p}`;
  };

  const pagesSet = new Set<number>();
  pagesSet.add(1);
  if (current - 1 > 1) pagesSet.add(current - 1);
  pagesSet.add(current);
  if (current + 1 < safeTotal) pagesSet.add(current + 1);
  pagesSet.add(safeTotal);

  const pages = Array.from(pagesSet).sort((a, b) => a - b);

  return (
    <Pagination>
      <PaginationContent>
        {/* First */}
        <PaginationItem>
          <Button
            variant="ghost"
            asChild
            disabled={!canGoPrev}
            aria-label="First page"
          >
            <Link href={createHref(1)}>
              <ChevronFirst className="rtl:rotate-180" />
            </Link>
          </Button>
        </PaginationItem>

        {/* Previous */}
        <PaginationItem>
          <Button
            variant="ghost"
            asChild
            disabled={!canGoPrev}
            aria-label="Previous page"
          >
            <Link href={createHref(current - 1)}>
              <ChevronLeft className="rtl:rotate-180" />
            </Link>
          </Button>
        </PaginationItem>

        {/* Numbers + ellipsis */}
        {pages.map((p, index) => {
          const prev = pages[index - 1];

          return (
            <span key={p} className="flex items-center">
              {index > 0 && prev !== undefined && p - prev > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  asChild
                  variant={p === current ? "outline" : "ghost"}
                  aria-current={p === current ? "page" : undefined}
                >
                  <Link href={createHref(p)}>{p}</Link>
                </Button>
              </PaginationItem>
            </span>
          );
        })}

        {/* Next */}
        <PaginationItem>
          <Button
            variant="ghost"
            asChild
            disabled={!canGoNext}
            aria-label="Next page"
          >
            <Link href={createHref(current + 1)}>
              <ChevronRight className="rtl:rotate-180" />
            </Link>
          </Button>
        </PaginationItem>

        {/* Last */}
        <PaginationItem>
          <Button
            variant="ghost"
            asChild
            disabled={!canGoNext}
            aria-label="Last page"
          >
            <Link href={createHref(safeTotal)}>
              <ChevronLast className="rtl:rotate-180" />
            </Link>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
