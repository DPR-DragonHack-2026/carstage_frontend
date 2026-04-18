"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { toStoredImage } from "@/modules/uploads/file-utils";
import type { StoredImage } from "@/types/carstage";

interface LogoUploadPanelProps {
  logo?: StoredImage;
  onChange: (nextLogo?: StoredImage) => void;
}

export function LogoUploadPanel({ logo, onChange }: LogoUploadPanelProps) {
  const handleFiles = async (files: File[]) => {
    if (!files[0]) {
      return;
    }
    const nextLogo = await toStoredImage(files[0]);
    onChange(nextLogo);
  };

  return (
    <div className="space-y-4">
      <Dropzone
        label="Upload your logo"
        description="PNG or SVG preferred. We pass this to generation backend."
        multiple={false}
        onFiles={handleFiles}
      />

      {logo && (
        <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
          <p className="mb-2 text-sm font-semibold text-slate-100">Selected logo</p>
          <div className="relative h-28 w-full overflow-hidden rounded-md border border-slate-700 bg-slate-900">
            <Image src={logo.dataUrl} alt={logo.name} fill className="object-contain p-3" />
          </div>
          <div className="mt-3">
            <Button variant="outline" onClick={() => onChange(undefined)}>
              Remove logo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
