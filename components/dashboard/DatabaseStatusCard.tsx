import { CheckCircle2, XCircle, Database } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { DatabaseStatus } from "@/lib/dashboard";

interface DatabaseStatusCardProps {
  status: DatabaseStatus;
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-zinc-600">{label}</span>
      {ok ? (
        <span className="flex items-center gap-1.5 font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          Yes
        </span>
      ) : (
        <span className="flex items-center gap-1.5 font-medium text-red-600">
          <XCircle className="h-4 w-4" />
          No
        </span>
      )}
    </div>
  );
}

export function DatabaseStatusCard({ status }: DatabaseStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
            <Database className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Database Status</h3>
            <p className="text-xs text-zinc-500">Live connection &amp; migration state</p>
          </div>
        </div>
        <Badge tone={status.connected ? "success" : "danger"}>
          {status.connected ? "Connected" : "Disconnected"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-zinc-100">
          <StatusRow label="Database Connected" ok={status.connected} />
          <StatusRow label="Migration Applied" ok={status.migrationApplied} />
          <StatusRow label="Geography Seed Completed" ok={status.geographySeedCompleted} />
        </div>
        <div className="mt-1 flex items-center justify-between border-t border-zinc-100 pt-3">
          <span className="text-sm text-zinc-600">Total Records</span>
          <span className="text-sm font-semibold text-zinc-900">
            {status.totalRecords.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
