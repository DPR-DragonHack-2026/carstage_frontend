"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jobService } from "@/lib/api/jobs";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OutputGallery } from "@/modules/gallery/output-gallery";
import type { GenerationJob } from "@/types/carstage";

export default function JobDetailPage() {
  const params = useParams<{ jobId: string }>();
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jobId = params.jobId;
    if (!jobId) {
      return;
    }

    const load = async () => {
      const result = await jobService.getJobById(jobId);
      setJob(result);
      setIsLoading(false);
    };

    void load();
    const interval = window.setInterval(() => {
      void load();
    }, 1000);
    return () => window.clearInterval(interval);
  }, [params.jobId]);

  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-slate-400">Loading job details...</p>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card className="space-y-2">
        <p className="text-sm text-slate-300">Job not found.</p>
        <Link className="text-sm font-semibold text-cyan-300" href="/jobs/history">
          Go to job history
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{job.title}</h1>
            <p className="text-sm text-slate-400">
              Created {new Date(job.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={job.status} />
        </div>
        <Progress value={job.progress} />
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100">Inputs</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-300">
              Car uploads ({job.carImages.length})
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {job.carImages.map((image) => (
                <div
                  key={image.id}
                  className="relative h-28 overflow-hidden rounded-md border border-slate-700"
                >
                  <Image src={image.dataUrl} alt={image.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-300">
              Selected backgrounds ({job.selectedBackgroundIds.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {job.selectedBackgroundIds.map((id) => (
                <span
                  key={id}
                  className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300"
                >
                  {id}
                </span>
              ))}
            </div>
            {job.logo && (
              <>
                <p className="pt-2 text-sm font-semibold text-slate-300">Logo</p>
                <div className="relative h-24 w-40 overflow-hidden rounded-md border border-slate-700 bg-slate-950">
                  <Image src={job.logo.dataUrl} alt={job.logo.name} fill className="object-contain p-2" />
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <OutputGallery outputs={job.outputs} />
    </div>
  );
}
