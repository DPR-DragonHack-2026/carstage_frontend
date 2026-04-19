"use client";

import { cn } from "@/components/ui/cn";

export type JobMode = "single" | "batch";

interface JobModeTabsProps {
  value: JobMode;
  onChange: (next: JobMode) => void;
}

interface ModeOption {
  id: JobMode;
  title: string;
  blurb: string;
  pill: string;
  pillTone: "cyan" | "orange";
  locked?: boolean;
}

const options: ModeOption[] = [
  {
    id: "single",
    title: "Single Image",
    blurb: "Stage one car at a time. Uses 1 credit per render.",
    pill: "Pay-as-you-go",
    pillTone: "cyan",
  },
  {
    id: "batch",
    title: "Batch Request",
    blurb: "Queue an entire inventory in one submission.",
    pill: "Dealership",
    pillTone: "orange",
    locked: true,
  },
];

export function JobModeTabs({ value, onChange }: JobModeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Generation mode"
      className="grid gap-3 sm:grid-cols-2"
    >
      {options.map((option) => (
        <ModeTile
          key={option.id}
          option={option}
          isActive={value === option.id}
          onSelect={() => onChange(option.id)}
        />
      ))}
    </div>
  );
}

interface ModeTileProps {
  option: ModeOption;
  isActive: boolean;
  onSelect: () => void;
}

function ModeTile({ option, isActive, onSelect }: ModeTileProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onSelect}
      className={cn(
        "group relative flex h-full cursor-crosshair flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-colors",
        isActive
          ? "border-orange-400/70 bg-slate-950/80 shadow-[0_0_0_1px_rgba(249,115,22,0.35)]"
          : "border-white/10 bg-slate-950/60 hover:border-white/30"
      )}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-white">{option.title}</h3>
          {option.locked && <LockBadge />}
        </div>
        <Pill tone={option.pillTone}>{option.pill}</Pill>
      </div>
      <p className="text-sm text-slate-300">{option.blurb}</p>
    </button>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "cyan" | "orange";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider",
        tone === "cyan"
          ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
          : "border-orange-400/60 bg-orange-500/10 text-orange-200"
      )}
    >
      {children}
    </span>
  );
}

function LockBadge() {
  return (
    <span
      className="inline-flex items-center text-orange-300"
      title="Dealership only"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    </span>
  );
}
