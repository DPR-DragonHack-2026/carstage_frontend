"use client";

import Image from "next/image";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { bytesToReadable } from "@/lib/utils";
import type { StoredImage } from "@/types/carstage";
import { toStoredImages } from "@/modules/uploads/file-utils";

interface CarUploadPanelProps {
  images: StoredImage[];
  onChange: (nextImages: StoredImage[]) => void;
}

export function CarUploadPanel({ images, onChange }: CarUploadPanelProps) {
  const handleFiles = async (files: File[]) => {
    const next = await toStoredImages(files);
    onChange([...images, ...next]);
  };

  return (
    <div className="space-y-4">
      <Dropzone
        label="Upload car photos"
        description="Drag and drop multiple images, or click to browse."
        multiple
        onFiles={handleFiles}
      />
      {images.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-lg border border-slate-700 bg-slate-950"
              >
                <div className="relative h-32 w-full">
                  <Image src={image.dataUrl} alt={image.name} fill className="object-cover" />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-slate-100">{image.name}</p>
                  <p className="text-[11px] text-slate-400">{bytesToReadable(image.size)}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => onChange([])}>
            Clear car images
          </Button>
        </>
      )}
    </div>
  );
}
