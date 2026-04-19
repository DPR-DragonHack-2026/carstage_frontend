"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ProgressWithPercent } from "@/components/ui/progress-with-percent";
import { DeleteJobButton } from "@/modules/jobs/delete-job-button";
import type { GenerationJob, JobOutput, StoredImage } from "@/types/carstage";

interface JobCardProps {
  job: GenerationJob;
  onDeleted?: (jobId: string) => void;
  /** When true, the first thumbnail loads eagerly (LCP when this card is above the fold). */
  priorityFirstImage?: boolean;
}

export function JobCard({ job, onDeleted, priorityFirstImage }: JobCardProps) {
  const isRunning = job.status === "processing" || job.status === "queued";
  const generatedOutput =
    job.status === "completed" ? job.outputs[0] : undefined;

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-100">{job.title}</h3>
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
          <DeleteJobButton
            jobId={job.id}
            jobTitle={job.title}
            appearance="icon"
            disabled={isRunning}
            disabledHint="Wait for the render to finish before deleting."
            onDeleted={onDeleted}
          />
        </div>
      </div>
      <p className="text-xs text-slate-400">
        {new Date(job.createdAt).toLocaleString()} - {job.carImages.length} cars
      </p>
      <p className="text-xs text-slate-400">
        {job.selectedBackgroundIds.length} backgrounds - {job.outputs.length} outputs
      </p>
      <ProgressWithPercent value={job.progress} />

      {generatedOutput ? (
        <GeneratedThumbnail output={generatedOutput} priority={priorityFirstImage} />
      ) : (
        <RawCarThumbnails
          cars={job.carImages}
          priorityFirstImage={priorityFirstImage}
        />
      )}

      <Link
        className="inline-flex text-sm font-semibold text-cyan-300 underline-offset-4 hover:underline"
        href={`/jobs/${job.id}`}
      >
        View job details
      </Link>
    </Card>
  );
}

function GeneratedThumbnail({
  output,
  priority,
}: {
  output: JobOutput;
  priority?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
        Generated
      </p>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-emerald-500/30">
        <Image
          src={output.imageUrl}
          alt="Generated stage render"
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          priority={Boolean(priority)}
          loading={priority ? "eager" : undefined}
          unoptimized
          className="object-cover"
        />
      </div>
    </div>
  );
}

function RawCarThumbnails({
  cars,
  priorityFirstImage,
}: {
  cars: StoredImage[];
  priorityFirstImage?: boolean;
}) {
  const visible = cars.filter((img) => img.dataUrl);
  if (!visible.length) {
    return null;
  }
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
        Source
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {visible.map((image, thumbIndex) => (
          <div
            key={image.id}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-slate-700"
          >
            <Image
              src={image.dataUrl}
              alt={image.name}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              priority={Boolean(priorityFirstImage && thumbIndex === 0)}
              loading={
                priorityFirstImage && thumbIndex === 0 ? "eager" : undefined
              }
              unoptimized={image.dataUrl.startsWith("http")}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
