import { cn } from "@/components/ui/cn";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-slate-800", className)}>
      <div
        className="h-full rounded-full bg-cyan-400 transition-all duration-500"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
