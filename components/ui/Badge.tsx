import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "success" | "warning" | "danger" | "neutral";

const toneStyles: Record<BadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  neutral: "bg-zinc-100 text-zinc-600 ring-zinc-500/10",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

/**
 * Single source of truth for status pills across the ERP (database status,
 * and later: Active/Inactive/Archived on School, Campus, Student, Employee).
 * Do not create a second Badge component — add a new tone here if needed.
 */
export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
