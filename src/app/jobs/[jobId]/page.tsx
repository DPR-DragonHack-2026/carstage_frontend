"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatRendererError } from "@/lib/api/errors";
import { jobService } from "@/lib/api/jobs";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ProgressWithPercent } from "@/components/ui/progress-with-percent";
import { OutputGallery } from "@/modules/gallery/output-gallery";
import { DeleteJobButton } from "@/modules/jobs/delete-job-button";
import type { GenerationJob } from "@/types/carstage";

const TERMINAL_STATUSES = new Set(["completed", "failed"]);
const POLL_INTERVAL_MS = 1500;

export default function JobDetailPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>("");
  const stopPollingRef = useRef(false);

  const handleDeleted = () => {
    router.push("/jobs/history");
  };

  useEffect(() => {
    const jobId = params.jobId;
    if (!jobId) {
      return;
    }

    stopPollingRef.current = false;

    const load = async () => {
      try {
        const result = await jobService.getJobById(jobId);
        setJob(result);
        setLoadError("");
        if (result && TERMINAL_STATUSES.has(result.status)) {
          stopPollingRef.current = true;
        }
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Could not load job."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
    const interval = window.setInterval(() => {
      if (stopPollingRef.current) {
        window.clearInterval(interval);
        return;
      }
      void load();
    }, POLL_INTERVAL_MS);
    return () => {
      stopPollingRef.current = true;
      window.clearInterval(interval);
    };
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
          <div className="flex items-center gap-3">
            <StatusBadge status={job.status} />
            <DeleteJobButton
              jobId={job.id}
              jobTitle={job.title}
              variant="outline"
              className="h-9 px-3 text-sm text-red-300 border-red-500/40 hover:bg-red-500/10"
              disabled={
                job.status === "processing" || job.status === "queued"
              }
              disabledHint="Wait for the render to finish before deleting."
              onDeleted={handleDeleted}
            />
          </div>
        </div>
        <ProgressWithPercent value={job.progress} />
        {job.status === "queued" && typeof job.queuePosition === "number" && (
          <p className="text-xs text-slate-400">
            Queue position: {job.queuePosition}
          </p>
        )}
        {job.errorMessage && (
          <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {formatRendererError(job.errorMessage)}
          </p>
        )}
        {loadError && (
          <p className="text-xs text-red-300">Status fetch failed: {loadError}</p>
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100">Inputs</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-300">
              Car uploads ({job.carImages.length})
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {job.carImages.map((image) =>
                image.dataUrl ? (
                  <div
                    key={image.id}
                    className="relative h-28 overflow-hidden rounded-md border border-slate-700"
                  >
                    <Image
                      src={image.dataUrl}
                      alt={image.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      unoptimized={
                        image.dataUrl.startsWith("http://") ||
                        image.dataUrl.startsWith("https://")
                      }
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    key={image.id}
                    className="flex h-28 items-center justify-center rounded-md border border-dashed border-slate-700 px-3 text-center text-xs text-slate-500"
                  >
                    Original car image not stored on this device.
                  </div>
                )
              )}
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
            {job.licensePlate && (
              <>
                <p className="pt-2 text-sm font-semibold text-slate-300">License plate</p>
                <span className="inline-flex items-center rounded-md border-2 border-black bg-white px-3 py-1 font-mono text-base font-bold uppercase tracking-[0.3em] text-slate-900">
                  {job.licensePlate}
                </span>
              </>
            )}
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

      <OutputGallery outputs={job.outputs} carImages={job.carImages} />
    </div>
  );
}
