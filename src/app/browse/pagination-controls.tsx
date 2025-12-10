"use client";

import { Button } from "@/components/ui/button";
import { useQueryState, parseAsInteger } from "nuqs";

const pageParam = parseAsInteger.withDefault(1);

type Props = {
  page: number;
  totalPages: number;
};

export function PaginationControls({ page, totalPages }: Props) {
  const [pageState, setPage] = useQueryState("page", pageParam);

  const current = pageState ?? page;

  const goTo = (next: number) => {
    setPage(next, {
      shallow: false,
      history: "push",
      scroll: true,
    });
  };

  return (
    <div className="flex flex-col gap-3 pt-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-center sm:text-left">
        Page {current} of {totalPages}
      </span>
      <div className="flex w-full justify-center gap-2 sm:w-auto sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          disabled={current <= 1}
          onClick={() => goTo(current - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          disabled={current >= totalPages}
          onClick={() => goTo(current + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
