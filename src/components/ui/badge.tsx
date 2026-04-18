import { cn } from "@/components/ui/cn";
import type { JobStatus } from "@/types/carstage";

const statusStyles: Record<JobStatus, string> = {
  draft: "bg-slate-800 text-slate-300",
  queued: "bg-amber-900/50 text-amber-300",
  processing: "bg-blue-900/50 text-blue-300",
  completed: "bg-emerald-900/50 text-emerald-300",
  failed: "bg-red-900/50 text-red-300",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
