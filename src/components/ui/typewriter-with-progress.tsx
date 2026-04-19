"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";
import { ProgressWithPercent } from "@/components/ui/progress-with-percent";
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
      <ProgressWithPercent value={percent} />
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
