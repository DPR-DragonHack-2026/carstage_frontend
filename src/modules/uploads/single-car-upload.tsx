"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { bytesToReadable } from "@/lib/utils";
import { toStoredImage } from "@/modules/uploads/file-utils";
import type { StoredImage } from "@/types/carstage";

interface SingleCarUploadProps {
  image?: StoredImage;
  onChange: (next?: StoredImage) => void;
}

export function SingleCarUpload({ image, onChange }: SingleCarUploadProps) {
  const handleFiles = async (files: File[]) => {
    if (!files[0]) {
      return;
    }
    const next = await toStoredImage(files[0]);
    onChange(next);
  };

  if (!image) {
    return (
      <Dropzone
        label="Upload your car photo"
        description="One image, JPG or PNG. Lot or phone shots welcome."
        multiple={false}
        onFiles={handleFiles}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
      <div className="relative h-64 w-full">
        <Image
          src={image.dataUrl}
          alt={image.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">
            {image.name}
          </p>
          <p className="text-xs text-slate-400">{bytesToReadable(image.size)}</p>
        </div>
        <Button variant="outline" onClick={() => onChange(undefined)}>
          Replace photo
        </Button>
      </div>
    </div>
  );
}
