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
      history: "push", // ⬅️ triggers a proper navigation
      scroll: true,
    });
  };

  return (
    <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
      <span>
        Page {current} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={current <= 1}
          onClick={() => goTo(current - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={current >= totalPages}
          onClick={() => goTo(current + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
