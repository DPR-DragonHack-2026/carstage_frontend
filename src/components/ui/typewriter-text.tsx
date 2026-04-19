"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

interface TypewriterTextProps {
  text: string;
  speedMs?: number;
  startDelayMs?: number;
  className?: string;
  cursorClassName?: string;
  onProgress?: (progress: number) => void;
}

export function TypewriterText({
  text,
  speedMs = 25,
  startDelayMs = 150,
  className,
  cursorClassName,
  onProgress,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const emitProgress = (value: number) => {
      onProgressRef.current?.(value);
    };

    const clearTimers = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (delayRef.current) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }
    };

    const startTyping = () => {
      clearTimers();
      setDisplayed("");
      emitProgress(0);
      delayRef.current = setTimeout(() => {
        let index = 0;
        intervalRef.current = setInterval(() => {
          index += 1;
          setDisplayed(text.slice(0, index));
          emitProgress(text.length === 0 ? 1 : index / text.length);
          if (index >= text.length && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }, speedMs);
      }, startDelayMs);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTyping();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [text, speedMs, startDelayMs]);

  return (
    <span ref={containerRef} className={cn("grid", className)}>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span className="col-start-1 row-start-1">
        {displayed}
        <span
          aria-hidden
          className={cn(
            "font-bold text-orange-400 animate-typewriter-blink",
            cursorClassName
          )}
        >
          _
        </span>
      </span>
    </span>
  );
}
