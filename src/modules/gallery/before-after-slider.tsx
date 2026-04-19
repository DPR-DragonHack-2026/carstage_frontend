"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

const TWO_PI = Math.PI * 2;
const ANGULAR_SPEED = 0.0011;
const DEFAULT_INITIAL_POSITION = 15;
const DEFAULT_ASPECT_CLASS = "aspect-[16/9]";
const DEFAULT_SIZES = "(min-width: 1024px) 60vw, 100vw";

export interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  aspectClassName?: string;
  initialPosition?: number;
  autoplay?: boolean;
  unoptimized?: boolean;
  sizes?: string;
  beforeBadgeLabel?: string;
  afterBadgeLabel?: string;
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeAlt = "Before",
  afterAlt = "After",
  className,
  aspectClassName = DEFAULT_ASPECT_CLASS,
  initialPosition = DEFAULT_INITIAL_POSITION,
  autoplay = true,
  unoptimized,
  sizes = DEFAULT_SIZES,
  beforeBadgeLabel = "Before",
  afterBadgeLabel = "After",
}: BeforeAfterSliderProps) {
  const clampedInitial = clampPosition(initialPosition);
  const [position, setPosition] = useState<number>(clampedInitial);
  const [isAutoplaying, setIsAutoplaying] = useState<boolean>(autoplay);
  const isAutoplayingRef = useRef<boolean>(autoplay);
  const phaseRef = useRef<number>(Math.acos((50 - clampedInitial) / 50));

  useEffect(() => {
    isAutoplayingRef.current = isAutoplaying;
  }, [isAutoplaying]);

  useEffect(() => {
    if (!autoplay) {
      return;
    }

    let rafId = 0;
    let lastTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (!isAutoplayingRef.current) {
        lastTimestamp = null;
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      phaseRef.current += ANGULAR_SPEED * delta;
      setPosition(positionFromPhase(phaseRef.current));

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [autoplay]);

  const pauseAutoplay = () => setIsAutoplaying(false);
  const resumeAutoplay = () => {
    if (autoplay) {
      setIsAutoplaying(true);
    }
  };

  const handleManualChange = (next: number) => {
    phaseRef.current = phaseFromPosition(next, phaseRef.current);
    setPosition(next);
  };

  const beforeUnoptimized = unoptimized ?? isRemoteHttpUrl(beforeUrl);
  const afterUnoptimized = unoptimized ?? isRemoteHttpUrl(afterUrl);

  return (
    <div
      className={cn("relative w-full select-none overflow-hidden", aspectClassName, className)}
      onPointerEnter={pauseAutoplay}
      onPointerLeave={resumeAutoplay}
    >
      <Image
        src={afterUrl}
        alt={afterAlt}
        fill
        sizes={sizes}
        unoptimized={afterUnoptimized}
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeUrl}
          alt={beforeAlt}
          fill
          sizes={sizes}
          unoptimized={beforeUnoptimized}
          className="object-cover"
        />
      </div>

      <SliderHandle position={position} isPulsing={isAutoplaying} />

      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={position}
        onChange={(event) => handleManualChange(Number(event.target.value))}
        onPointerDown={pauseAutoplay}
        aria-label="Before / after comparison position"
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />

      <BadgeLabel className="left-4 top-4 border-slate-700/70 bg-slate-950/70 text-slate-200">
        {beforeBadgeLabel}
      </BadgeLabel>
      <BadgeLabel className="right-4 top-4 border-orange-500 bg-orange-700 text-white">
        {afterBadgeLabel}
      </BadgeLabel>
    </div>
  );
}

function clampPosition(value: number): number {
  if (Number.isNaN(value)) {
    return DEFAULT_INITIAL_POSITION;
  }
  return Math.max(0, Math.min(100, value));
}

function isRemoteHttpUrl(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

function positionFromPhase(phase: number): number {
  return 50 - 50 * Math.cos(phase);
}

function phaseFromPosition(position: number, currentPhase: number): number {
  const clamped = clampPosition(position);
  const baseAngle = Math.acos((50 - clamped) / 50);
  const cycleStart = Math.floor(currentPhase / TWO_PI) * TWO_PI;
  const phaseInCycle = currentPhase - cycleStart;
  return phaseInCycle <= Math.PI
    ? cycleStart + baseAngle
    : cycleStart + TWO_PI - baseAngle;
}

function SliderHandle({
  position,
  isPulsing,
}: {
  position: number;
  isPulsing: boolean;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-y-0 w-px bg-white/80 transition-shadow duration-300",
        isPulsing
          ? "animate-slider-line-pulse"
          : "shadow-[0_0_12px_rgba(255,255,255,0.6)]"
      )}
      style={{ left: `${position}%` }}
    >
      <div
        className={cn(
          "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-slate-950/80 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white transition-colors duration-300",
          isPulsing ? "border-orange-400/80" : "border-white/70"
        )}
      >
        Drag
      </div>
    </div>
  );
}

function BadgeLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
