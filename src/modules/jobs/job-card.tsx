"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ProgressWithPercent } from "@/components/ui/progress-with-percent";
import { TrashIcon } from "@/components/ui/icons/trash";
import { cn } from "@/components/ui/cn";
import type { GenerationJob } from "@/types/carstage";

interface JobCardProps {
  job: GenerationJob;
  onDelete?: (jobId: string) => void | Promise<void>;
}

export function JobCard({ job, onDelete }: JobCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!onDelete || isDeleting) return;
    try {
      setIsDeleting(true);
      await onDelete(job.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={cn("space-y-3", isDeleting && "opacity-60")}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-100">{job.title}</h3>
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label={`Delete ${job.title} from history`}
              title="Delete from history"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-slate-900/60 text-slate-400 transition-all duration-150 ease-out hover:border-red-500/70 hover:bg-red-500/15 hover:text-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TrashIcon size={16} />
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-400">
        {new Date(job.createdAt).toLocaleString()} - {job.carImages.length} cars
      </p>
      <p className="text-xs text-slate-400">
        {job.selectedBackgroundIds.length} backgrounds - {job.outputs.length} outputs
      </p>
      <ProgressWithPercent value={job.progress} />
      {job.carImages[0] && (
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
