"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpNumberProps {
  value: string;
  durationMs?: number;
  startDelayMs?: number;
  className?: string;
}

interface ParsedValue {
  prefix: string;
  target: number;
  suffix: string;
  decimals: number;
}

export function CountUpNumber({
  value,
  durationMs = 1200,
  startDelayMs = 150,
  className,
}: CountUpNumberProps) {
  const parsed = parseAnimatedValue(value);
  const [display, setDisplay] = useState<number>(0);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let rafId = 0;
    let delayId: ReturnType<typeof setTimeout> | null = null;
    let startTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (startTimestamp === null) {
        startTimestamp = timestamp;
      }
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parsed.target * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      cancelAnimationFrame(rafId);
      if (delayId) clearTimeout(delayId);
      startTimestamp = null;
      setDisplay(0);
      delayId = setTimeout(() => {
        rafId = requestAnimationFrame(tick);
      }, startDelayMs);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      if (delayId) clearTimeout(delayId);
    };
  }, [parsed.target, durationMs, startDelayMs]);

  return (
    <span ref={containerRef} className={className}>
      {parsed.prefix}
      {display.toFixed(parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}

function parseAnimatedValue(value: string): ParsedValue {
  const match = value.match(/^([^\d.-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: "", target: 0, suffix: value, decimals: 0 };
  }
  const [, prefix, numericString, suffix] = match;
  const target = parseFloat(numericString);
  const decimals = numericString.includes(".")
    ? numericString.split(".")[1].length
    : 0;
  return { prefix, target, suffix, decimals };
}
