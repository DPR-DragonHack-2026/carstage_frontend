"use client";

import { cn } from "@/components/ui/cn";
import { Progress } from "@/components/ui/progress";

interface ProgressWithPercentProps {
  value: number;
  className?: string;
  barClassName?: string;
  trackClassName?: string;
  percentClassName?: string;
}

export function ProgressWithPercent({
  value,
  className,
  barClassName,
  trackClassName,
  percentClassName,
}: ProgressWithPercentProps) {
  const percent = Math.round(Math.max(0, Math.min(100, value)));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Progress
        value={percent}
        className={cn("h-1.5 flex-1 bg-slate-800/80", trackClassName)}
        barClassName={cn(
          "bg-orange-500 transition-all duration-100 ease-linear",
          barClassName
        )}
      />
      <span
        className={cn(
          "min-w-[3ch] text-right text-[11px] font-semibold tabular-nums text-orange-400",
          percentClassName
        )}
      >
        {percent}%
      </span>
    </div>
  );
}
