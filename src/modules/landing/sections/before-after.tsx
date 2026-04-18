"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";
import {
  beforeAfterExamples,
  type BeforeAfterExample,
} from "@/modules/landing/data/landing-content";
import { SectionHeading } from "@/modules/landing/sections/section-heading";

const SECTION_ID = "before-after";

type HighlightIcon = "timer" | "coins" | "sparkle";

interface BeforeAfterHighlight {
  text: string;
  icon: HighlightIcon;
}

const beforeAfterHighlights: BeforeAfterHighlight[] = [
  { icon: "timer", text: "Lot photo to studio render in 12s" },
  { icon: "coins", text: "$0 photographer fees and zero studio rental" },
  {
    icon: "sparkle",
    text: "Consistent, on-brand visuals across your entire inventory",
  },
];

export function BeforeAfter() {
  const [activeId, setActiveId] = useState<string>(beforeAfterExamples[0].id);
  const active =
    beforeAfterExamples.find((example) => example.id === activeId) ??
    beforeAfterExamples[0];

  return (
    <section id={SECTION_ID} className="relative py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Before / After"
          title="See the lift in seconds"
          subtitle="Drag the handle to compare a raw lot photo with a CarStage AI render."
        />

        <div className="mt-10 flex w-full flex-col gap-6 lg:grid lg:grid-cols-[1fr_260px]">
          <BeforeAfterSlider example={active} />
          <ExampleSwitcher activeId={activeId} onSelect={setActiveId} />
        </div>
      </div>
    </section>
  );
}

function ExampleSwitcher({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-row gap-3 lg:flex-col">
      {beforeAfterExamples.map((example) => {
        const isActive = example.id === activeId;
        return (
          <button
            key={example.id}
            type="button"
            onClick={() => onSelect(example.id)}
            className={cn(
              "group relative flex-1 overflow-hidden rounded-2xl border transition-colors",
              isActive
                ? "border-orange-500/70 bg-orange-500/10"
                : "border-white/10 bg-slate-950/40 hover:border-white/20"
            )}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={example.afterUrl}
                alt={example.label}
                fill
                sizes="(min-width: 1024px) 220px, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-left">
              <span className="text-sm font-medium text-slate-100">
                {example.label}
              </span>
              {isActive && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-orange-300">
                  Viewing
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

const TWO_PI = Math.PI * 2;
const ANGULAR_SPEED = 0.0011;

function positionFromPhase(phase: number): number {
  return 50 - 50 * Math.cos(phase);
}

function phaseFromPosition(position: number, currentPhase: number): number {
  const clamped = Math.max(0, Math.min(100, position));
  const baseAngle = Math.acos((50 - clamped) / 50);
  const cycleStart = Math.floor(currentPhase / TWO_PI) * TWO_PI;
  const phaseInCycle = currentPhase - cycleStart;
  return phaseInCycle <= Math.PI
    ? cycleStart + baseAngle
    : cycleStart + TWO_PI - baseAngle;
}

function BeforeAfterSlider({ example }: { example: BeforeAfterExample }) {
  const initialPosition = 15;
  const [position, setPosition] = useState<number>(initialPosition);
  const [isAutoplaying, setIsAutoplaying] = useState<boolean>(true);
  const isAutoplayingRef = useRef<boolean>(true);
  const phaseRef = useRef<number>(Math.acos((50 - initialPosition) / 50));

  useEffect(() => {
    isAutoplayingRef.current = isAutoplaying;
  }, [isAutoplaying]);

  useEffect(() => {
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
  }, []);

  const pauseAutoplay = () => setIsAutoplaying(false);
  const resumeAutoplay = () => setIsAutoplaying(true);

  const handleManualChange = (next: number) => {
    phaseRef.current = phaseFromPosition(next, phaseRef.current);
    setPosition(next);
  };

  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl">
      <div
        className="relative aspect-[16/9] w-full select-none"
        onPointerEnter={pauseAutoplay}
        onPointerLeave={resumeAutoplay}
      >
        <Image
          src={example.afterUrl}
          alt={`${example.label} after`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={example.beforeUrl}
            alt={`${example.label} before`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
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
          Before
        </BadgeLabel>
        <BadgeLabel className="right-4 top-4 border-orange-500 bg-orange-700 text-white">
          After
        </BadgeLabel>
      </div>
      <BeforeAfterHighlights />
    </div>
  );
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

function BeforeAfterHighlights() {
  return (
    <ul className="space-y-2 border-t border-white/5 px-5 py-4">
      {beforeAfterHighlights.map((item) => (
        <li
          key={item.text}
          className="flex items-start gap-3 text-sm text-slate-200"
        >
          <HighlightIconGlyph name={item.icon} />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function HighlightIconGlyph({ name }: { name: HighlightIcon }) {
  const iconClass = "mt-[2px] h-5 w-5 flex-shrink-0 text-orange-400";

  if (name === "timer") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M9 2h6" />
        <path d="M12 14v-4" />
        <circle cx="12" cy="14" r="8" />
      </svg>
    );
  }

  if (name === "coins") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <ellipse cx="9" cy="8" rx="6" ry="3" />
        <path d="M3 8v4c0 1.66 2.69 3 6 3s6-1.34 6-3V8" />
        <path d="M3 12v4c0 1.66 2.69 3 6 3s6-1.34 6-3v-4" />
        <ellipse cx="16" cy="16" rx="5" ry="2.5" />
        <path d="M11 16v3c0 1.38 2.24 2.5 5 2.5s5-1.12 5-2.5v-3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" />
      <path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
      <path d="M5 4l.4 1.2 1.2.4-1.2.4L5 7.2l-.4-1.2-1.2-.4 1.2-.4z" />
    </svg>
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
