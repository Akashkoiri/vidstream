"use client";

import { useFormStatus } from "react-dom";
import { Trash2, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export function SubmitButton({ 
  text = "Submit", 
  variant = "default",
  className
}: { 
  text?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant={variant} className={className}>
      {pending && <Spinner className="h-4 w-4 mr-2 inline" />}
      {text}
    </Button>
  );
}

export function DeleteButton({ 
  variant = "circle",
  icon = "cross",
  requireConfirm = false,
  confirmMessage = "Are you sure you want to delete this?"
}: { 
  variant?: "circle" | "icon";
  icon?: "trash" | "cross";
  requireConfirm?: boolean;
  confirmMessage?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      onClick={(e) => {
        if (requireConfirm && !window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className={
        variant === "circle" ? `
          flex items-center justify-center
          rounded-full p-1.5 m-1
          bg-red-500/20 text-red-400
          hover:bg-red-500/30 hover:text-red-300
          transition
          border border-red-400/30
          disabled:opacity-50 disabled:cursor-not-allowed
          backdrop-blur-sm
        ` : `
          flex items-center justify-center
          p-1 text-red-400 hover:text-red-300 transition
          disabled:opacity-50 disabled:cursor-not-allowed
        `
      }
    >
      {pending ? (
        <Spinner className="h-4 w-4" />
      ) : icon === "trash" ? (
        <Trash2 className="h-4 w-4" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </button>
  );
}
