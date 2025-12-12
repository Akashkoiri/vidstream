"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`
        flex items-center justify-center
        rounded-full p-1.5 m-1
        bg-red-500/20 text-red-400
        hover:bg-red-500/30 hover:text-red-300
        transition
        border border-red-400/30
        disabled:opacity-50 disabled:cursor-not-allowed
        backdrop-blur-sm
      `}
    >
      {pending ? (
        <Spinner className="h-4 w-4" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
