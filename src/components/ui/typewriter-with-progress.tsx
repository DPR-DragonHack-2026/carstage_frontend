"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";
import { Progress } from "@/components/ui/progress";
import { TypewriterText } from "@/components/ui/typewriter-text";

interface TypewriterWithProgressProps {
  text: string;
  speedMs?: number;
  startDelayMs?: number;
  className?: string;
  textClassName?: string;
}

export function TypewriterWithProgress({
  text,
  speedMs,
  startDelayMs,
  className,
  textClassName,
}: TypewriterWithProgressProps) {
  const [progress, setProgress] = useState(0);
  const percent = Math.round(progress * 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-3">
        <Progress
          value={percent}
          className="h-1.5 flex-1 bg-slate-800/80"
          barClassName="bg-orange-500 transition-all duration-100 ease-linear"
        />
        <span className="min-w-[3ch] text-right text-[11px] font-semibold tabular-nums text-orange-400">
          {percent}%
        </span>
      </div>
      <TypewriterText
        text={text}
        speedMs={speedMs}
        startDelayMs={startDelayMs}
        className={textClassName}
        onProgress={setProgress}
      />
    </div>
  );
}
