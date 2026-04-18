"use client";

import { useId, useState } from "react";
import { cn } from "@/components/ui/cn";

interface DropzoneProps {
  label: string;
  description: string;
  multiple?: boolean;
  accept?: string;
  onFiles: (files: File[]) => void;
}

export function Dropzone({
  label,
  description,
  multiple = false,
  accept = "image/*",
  onFiles,
}: DropzoneProps) {
  const inputId = useId();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }
    onFiles(Array.from(fileList));
  };

  return (
    <label
      htmlFor={inputId}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900 px-6 py-8 text-center transition-colors",
        isDragOver && "border-cyan-300 bg-slate-800"
      )}
    >
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <span className="mt-1 text-xs text-slate-400">{description}</span>
      <input
        id={inputId}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => handleFiles(event.target.files)}
      />
    </label>
  );
}
