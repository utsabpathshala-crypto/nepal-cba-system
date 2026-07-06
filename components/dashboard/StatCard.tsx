import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type StatCardAccent = "indigo" | "emerald" | "amber" | "sky" | "rose" | "violet";

const accentStyles: Record<StatCardAccent, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  sky: "bg-sky-50 text-sky-600",
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-600",
};

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: StatCardAccent;
}

/**
 * One reusable tile for every dashboard metric (Municipality Types, Provinces,
 * Schools, Students, ...). Do not create a per-metric component — pass
 * different label/value/icon/accent props into this one.
 */
export function StatCard({ label, value, icon: Icon, accent = "indigo" }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            accentStyles[accent],
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
        {value.toLocaleString()}
      </p>
    </Card>
  );
}
