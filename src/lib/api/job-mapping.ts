import type { LocalJobMetadata } from "@/lib/api/job-store";
import type {
  GenerationJob,
  JobOutput,
  JobStatus,
  StoredImage,
} from "@/types/carstage";

export type BackendJobStatus = "queued" | "running" | "completed" | "failed";

export interface JobCreateResponse {
  job_id: string;
  status: BackendJobStatus;
  queue_position: number;
  status_url: string;
  result_url: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: BackendJobStatus;
  queue_position: number;
  queued_count: number;
  run_id?: string | null;
  model?: string | null;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
  error?: string | null;
  result_ready: boolean;
}

const BACKEND_TO_UI_STATUS: Record<BackendJobStatus, JobStatus> = {
  queued: "queued",
  running: "processing",
  completed: "completed",
  failed: "failed",
};

function progressFor(status: JobStatusResponse): number {
  switch (status.status) {
    case "queued": {
      const offset = Math.max(0, 6 - status.queue_position) * 2;
      return Math.min(20, 8 + offset);
    }
    case "running":
      return 65;
    case "completed":
      return 100;
    case "failed":
      return 100;
    default:
      return 0;
  }
}

function resultProxyUrl(jobId: string): string {
  return `/api/showroom/jobs/${encodeURIComponent(jobId)}/result`;
}

function buildOutputs(
  status: JobStatusResponse
): JobOutput[] {
  if (status.status !== "completed" || !status.result_ready) {
    return [];
  }
  return [
    {
      id: `${status.job_id}-result`,
      imageUrl: resultProxyUrl(status.job_id),
      createdAt: status.finished_at ?? new Date().toISOString(),
    },
  ];
}

function placeholderCarImage(jobId: string): StoredImage {
  return {
    id: `${jobId}-car-missing`,
    name: "Car upload",
    dataUrl: "",
    size: 0,
    type: "image/*",
  };
}

export function toGenerationJob(
  status: JobStatusResponse,
  meta?: LocalJobMetadata
): GenerationJob {
  const finishedAt = status.finished_at ?? status.started_at ?? status.created_at;
  return {
    id: status.job_id,
    title:
      meta?.title?.trim() ||
      `Job ${new Date(status.created_at).toLocaleDateString()}`,
    status: BACKEND_TO_UI_STATUS[status.status] ?? "queued",
    progress: progressFor(status),
    createdAt: meta?.createdAt ?? status.created_at,
    updatedAt: finishedAt,
    carImages: meta ? [meta.carImage] : [placeholderCarImage(status.job_id)],
    logo: meta?.logo,
    licensePlate: meta?.licensePlate,
    selectedBackgroundIds: meta?.selectedBackgroundId
      ? [meta.selectedBackgroundId]
      : [],
    outputs: buildOutputs(status),
    errorMessage: status.error ?? undefined,
    queuePosition: status.queue_position,
  };
}

export function syntheticQueuedJob(
  created: JobCreateResponse,
  meta: LocalJobMetadata
): GenerationJob {
  return {
    id: created.job_id,
    title: meta.title?.trim() || `Job ${new Date(meta.createdAt).toLocaleDateString()}`,
    status: BACKEND_TO_UI_STATUS[created.status] ?? "queued",
    progress: 8,
    createdAt: meta.createdAt,
    updatedAt: meta.createdAt,
    carImages: [meta.carImage],
    logo: meta.logo,
    licensePlate: meta.licensePlate,
    selectedBackgroundIds: [meta.selectedBackgroundId],
    outputs: [],
    queuePosition: created.queue_position,
  };
}
