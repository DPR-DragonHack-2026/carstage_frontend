"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SimulatedProgressOptions {
  durationMs?: number;
  ceiling?: number;
  minTickMs?: number;
  maxTickMs?: number;
}

interface SimulatedProgressApi {
  value: number;
  start: () => void;
  finish: () => void;
  reset: () => void;
}

/**
 * Drives a fake progress bar that eases up to a `ceiling` (default 99)
 * over `durationMs` and then idles there with small jitter until either
 * `finish()` snaps it to 100 or `reset()` clears it back to 0.
 *
 * The curve is easeOutExpo, so it accelerates fast and crawls near the top -
 * which feels honest for an "almost done, just waiting on the worker" state.
 */
export function useSimulatedProgress({
  durationMs = 15_000,
  ceiling = 99,
  minTickMs = 90,
  maxTickMs = 170,
}: SimulatedProgressOptions = {}): SimulatedProgressApi {
  const [value, setValue] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const stoppedRef = useRef(true);

  const clearPendingTick = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleTick = useCallback(
    (handler: () => void) => {
      const delay = minTickMs + Math.random() * (maxTickMs - minTickMs);
      timeoutRef.current = window.setTimeout(handler, delay);
    },
    [maxTickMs, minTickMs]
  );

  const tick = useCallback(() => {
    if (stoppedRef.current || startedAtRef.current === null) {
      return;
    }

    const elapsed = performance.now() - startedAtRef.current;
    const t = Math.min(elapsed / durationMs, 1);
    const eased = 1 - Math.pow(2, -10 * t);
    const target = eased * ceiling;
    const jitter = (Math.random() - 0.3) * 0.8;

    setValue((current) => {
      const proposed = Math.min(ceiling, target + jitter);
      return Math.max(current, proposed);
    });

    scheduleTick(tick);
  }, [ceiling, durationMs, scheduleTick]);

  const start = useCallback(() => {
    clearPendingTick();
    stoppedRef.current = false;
    startedAtRef.current = performance.now();
    setValue(0);
    scheduleTick(tick);
  }, [clearPendingTick, scheduleTick, tick]);

  const finish = useCallback(() => {
    stoppedRef.current = true;
    clearPendingTick();
    setValue(100);
  }, [clearPendingTick]);

  const reset = useCallback(() => {
    stoppedRef.current = true;
    clearPendingTick();
    setValue(0);
  }, [clearPendingTick]);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      clearPendingTick();
    };
  }, [clearPendingTick]);

  return { value, start, finish, reset };
}
