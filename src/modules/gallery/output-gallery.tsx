"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { JobOutput } from "@/types/carstage";

interface OutputGalleryProps {
  outputs: JobOutput[];
}

function downloadImage(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
}

export function OutputGallery({ outputs }: OutputGalleryProps) {
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
        {outputs.map((output, index) => (
          <div key={output.id} className="rounded-lg border border-slate-700 bg-slate-950">
            <div className="relative h-40 w-full">
              <Image
                src={output.imageUrl}
                alt={`Generated variation ${index + 1}`}
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
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
        ))}
      </div>
    </Card>
  );
}
