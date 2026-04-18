"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/cn";
import type { BackgroundOption } from "@/types/carstage";

interface BackgroundPickerProps {
  backgrounds: BackgroundOption[];
  selectedIds: string[];
  onChange: (nextIds: string[]) => void;
}

export function BackgroundPicker({
  backgrounds,
  selectedIds,
  onChange,
}: BackgroundPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return backgrounds;
    }
    const text = query.toLowerCase();
    return backgrounds.filter((item) => {
      return (
        item.name.toLowerCase().includes(text) || item.location.toLowerCase().includes(text)
      );
    });
  }, [backgrounds, query]);

  const toggle = (id: string) => {
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
        placeholder="Search backgrounds by name or city"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((background) => {
          const isSelected = selectedIds.includes(background.id);
          return (
            <button
              type="button"
              key={background.id}
              onClick={() => toggle(background.id)}
              className={cn(
                "overflow-hidden rounded-lg border bg-slate-950 text-left transition-colors",
                isSelected
                  ? "border-cyan-300 ring-2 ring-cyan-300/20"
                  : "border-slate-700 hover:border-slate-500"
              )}
            >
              <div className="relative h-28 w-full">
                <Image
                  src={background.imageUrl}
                  alt={background.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-100">{background.name}</p>
                <p className="text-xs text-slate-400">{background.location}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
