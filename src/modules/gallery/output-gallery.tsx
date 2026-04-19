"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BeforeAfterSlider } from "@/modules/gallery/before-after-slider";
import type { JobOutput, StoredImage } from "@/types/carstage";

interface OutputGalleryProps {
  outputs: JobOutput[];
  carImages?: StoredImage[];
}

function downloadImage(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
}

function isRemoteHttpUrl(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

function pickBeforeUrl(
  carImages: StoredImage[] | undefined,
  index: number
): string | undefined {
  if (!carImages || carImages.length === 0) {
    return undefined;
  }
  return carImages[index]?.dataUrl ?? carImages[0]?.dataUrl;
}

export function OutputGallery({ outputs, carImages }: OutputGalleryProps) {
  const downloadAll = () => {
    outputs.forEach((output, index) => {
      downloadImage(output.imageUrl, `carstage-output-${index + 1}.jpg`);
    });
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Generated outputs</h2>
        <Button variant="outline" onClick={downloadAll} disabled={!outputs.length}>
          Download all
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {outputs.map((output, index) => {
          const beforeUrl = pickBeforeUrl(carImages, index);
          return (
            <div
              key={output.id}
              className="overflow-hidden rounded-lg border border-slate-700 bg-slate-950"
            >
              {beforeUrl ? (
                <BeforeAfterSlider
                  beforeUrl={beforeUrl}
                  afterUrl={output.imageUrl}
                  beforeAlt={`Original car ${index + 1}`}
                  afterAlt={`Generated variation ${index + 1}`}
                  aspectClassName="aspect-[4/3]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              ) : (
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={output.imageUrl}
                    alt={`Generated variation ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    unoptimized={isRemoteHttpUrl(output.imageUrl)}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-between p-3">
                <p className="text-xs font-semibold text-slate-300">Variation {index + 1}</p>
                <Button
                  variant="ghost"
                  className="h-8 px-2"
                  onClick={() => downloadImage(output.imageUrl, `carstage-${output.id}.jpg`)}
                >
                  Download
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
