"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/cn";
import type { BackgroundOption } from "@/types/carstage";

type SelectionMode = "single" | "multi";

interface BackgroundPickerProps {
  backgrounds: BackgroundOption[];
  selectedIds: string[];
  onChange: (nextIds: string[]) => void;
  mode?: SelectionMode;
}

export function BackgroundPicker({
  backgrounds,
  selectedIds,
  onChange,
  mode = "multi",
}: BackgroundPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return backgrounds;
    }
    const text = query.toLowerCase();
    return backgrounds.filter((item) => {
      return (
        item.name.toLowerCase().includes(text) ||
        item.location.toLowerCase().includes(text)
      );
    });
  }, [backgrounds, query]);

  const handleSelect = (id: string) => {
    if (mode === "single") {
      onChange(selectedIds[0] === id ? [] : [id]);
      return;
    }
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((entry) => entry !== id));
      return;
    }
    onChange([...selectedIds, id]);
  };

  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search backgrounds by name or style"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((background) => {
          const isSelected = selectedIds.includes(background.id);
          return (
            <button
              type="button"
              key={background.id}
              onClick={() => handleSelect(background.id)}
              className={cn(
                "group relative cursor-crosshair overflow-hidden rounded-xl border-2 bg-slate-950/60 text-left transition-all duration-150 ease-out will-change-transform hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_8px_28px_rgba(0,0,0,0.45)] active:scale-[0.99]",
                isSelected
                  ? "border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.45),0_0_22px_rgba(249,115,22,0.45)]"
                  : "border-white/10 hover:border-orange-400/60"
              )}
            >
              <div className="relative h-28 w-full overflow-hidden">
                <Image
                  src={background.imageUrl}
                  alt={background.name}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                  className="object-cover transition-transform duration-200 ease-out group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-100">
                  {background.name}
                </p>
                <p className="text-xs text-slate-400">{background.location}</p>
              </div>
              {isSelected && <SelectedCheckBadge />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectedCheckBadge() {
  return (
    <span
      aria-hidden
      className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-slate-950 shadow-[0_0_10px_rgba(249,115,22,0.6)] ring-2 ring-slate-950"
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12l5 5 9-11" />
      </svg>
    </span>
  );
}
