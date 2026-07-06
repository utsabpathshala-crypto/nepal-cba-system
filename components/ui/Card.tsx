import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Base surface used by every card-like component in the app
 * (StatCard, DatabaseStatusCard, and future table/list wrappers).
 * Do not create a second Card component — extend this one via className.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-zinc-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4 p-5 pb-3", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
