"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ProgressWithPercent } from "@/components/ui/progress-with-percent";
import { DeleteJobButton } from "@/modules/jobs/delete-job-button";
import type { GenerationJob } from "@/types/carstage";

interface JobCardProps {
  job: GenerationJob;
  onDeleted?: (jobId: string) => void;
}

export function JobCard({ job, onDeleted }: JobCardProps) {
  const isRunning = job.status === "processing" || job.status === "queued";

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
      {job.carImages[0] && job.carImages[0].dataUrl && (
        <div className="relative h-36 w-full overflow-hidden rounded-md border border-slate-700">
          <Image
            src={job.carImages[0].dataUrl}
            alt={job.carImages[0].name}
            fill
            className="object-cover"
          />
        </div>
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
