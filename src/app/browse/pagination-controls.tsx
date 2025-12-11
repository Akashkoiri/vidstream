"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryState, parseAsInteger } from "nuqs";

const pageParam = parseAsInteger.withDefault(1);

type Props = {
  page: number;
  totalPages: number;
};

export function PaginationControls({ page, totalPages }: Props) {
  const [pageState, setPage] = useQueryState("page", pageParam);
  const current = pageState ?? page;

  if (!totalPages || totalPages <= 1) return null;

  const goTo = (next: number) => {
    if (!totalPages) return;
    const clamped = Math.min(Math.max(next, 1), totalPages);
    if (clamped === current) return;

    setPage(clamped, {
      shallow: false,
      history: "push",
      scroll: true,
    });
  };

  const createPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const addRange = (from: number, to: number) => {
      for (let i = from; i <= to; i++) pages.push(i);
    };

    pages.push(1);

    const left = Math.max(2, current - 1);
    const right = Math.min(totalPages - 1, current + 1);

    if (left > 2) pages.push("...");
    addRange(left, right);
    if (right < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = createPageNumbers();

  return (
    <div className="flex w-full items-center justify-center pt-4 text-xs text-slate-400">
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={current <= 1}
              tabIndex={current <= 1 ? -1 : 0}
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                if (current > 1) goTo(current - 1);
              }}
            />
          </PaginationItem>

          {/* Numbers + ellipsis */}
          {pageNumbers.map((item, idx) =>
            item === "..." ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={item === current}
                  onClick={(e: { preventDefault: () => void }) => {
                    e.preventDefault();
                    goTo(item as number);
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={current >= totalPages}
              tabIndex={current >= totalPages ? -1 : 0}
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                if (current < totalPages) goTo(current + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
