import type { LocalJobMetadata } from "@/lib/api/job-store";
import type {
  GenerationJob,
  JobOutput,
  JobStatus,
  StoredImage,
} from "@/types/carstage";

export type BackendJobStatus = "queued" | "running" | "completed" | "failed";

const PROXY_BASE = "/api/showroom";

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
  /** Number of rendered outputs (variations). */
  output_count?: number;
  /** Uploaded source images count. */
  original_count?: number;
  /** Absolute or backend-relative URLs for each output image. */
  result_urls?: string[];
  /** Absolute or backend-relative URLs for each source car image. */
  original_urls?: string[];
  /** Raw backend list of output descriptors (URLs or objects with url). */
  outputs?: unknown;
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

export function resultProxyUrl(jobId: string): string {
  return `${PROXY_BASE}/jobs/${encodeURIComponent(jobId)}/result`;
}

export function resultProxyUrlIndexed(jobId: string, index: number): string {
  return `${PROXY_BASE}/jobs/${encodeURIComponent(jobId)}/result/${index}`;
}

export function originalProxyUrl(jobId: string): string {
  return `${PROXY_BASE}/jobs/${encodeURIComponent(jobId)}/original`;
}

export function originalProxyUrlIndexed(jobId: string, index: number): string {
  return `${PROXY_BASE}/jobs/${encodeURIComponent(jobId)}/original/${index}`;
}

export function toProxyResultUrl(jobId: string, url: string): string {
  if (url.startsWith(`${PROXY_BASE}/`)) {
    return url;
  }
  const match = url.match(/\/jobs\/([^/]+)\/result(?:\/(\d+))?(?:\?|$)/);
  if (match) {
    const idx = match[2];
    if (idx !== undefined) {
      return resultProxyUrlIndexed(jobId, parseInt(idx, 10));
    }
    return resultProxyUrl(jobId);
  }
  return url;
}

export function toProxyOriginalUrl(jobId: string, url: string): string {
  if (url.startsWith(`${PROXY_BASE}/`)) {
    return url;
  }
  const match = url.match(/\/jobs\/([^/]+)\/original(?:\/(\d+))?(?:\?|$)/);
  if (match) {
    const idx = match[2];
    if (idx !== undefined) {
      return originalProxyUrlIndexed(jobId, parseInt(idx, 10));
    }
    return originalProxyUrl(jobId);
  }
  return url;
}

function extractResultUrlsFromStatus(status: JobStatusResponse): string[] {
  if (Array.isArray(status.result_urls) && status.result_urls.length > 0) {
    return status.result_urls.map((u) => toProxyResultUrl(status.job_id, u));
  }

  const raw = status.outputs;
  if (Array.isArray(raw)) {
    const urls: string[] = [];
    for (const item of raw) {
      if (typeof item === "string") {
        urls.push(toProxyResultUrl(status.job_id, item));
      } else if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        const u =
          o.url ??
          o.image_url ??
          o.imageUrl ??
          o.href ??
          o.src;
        if (typeof u === "string") {
          urls.push(toProxyResultUrl(status.job_id, u));
        }
      }
    }
    if (urls.length) {
      return urls;
    }
  }

  return [];
}

function extractOriginalUrlsFromStatus(status: JobStatusResponse): string[] {
  const ext = status as unknown as Record<string, unknown>;
  const direct =
    status.original_urls ??
    (Array.isArray(ext.originalUrls) ? ext.originalUrls : undefined) ??
    (Array.isArray(ext.car_urls) ? ext.car_urls : undefined) ??
    (Array.isArray(ext.carUrls) ? ext.carUrls : undefined);

  if (Array.isArray(direct) && direct.length > 0) {
    const urls = direct.filter((u): u is string => typeof u === "string");
    return urls.map((u) => toProxyOriginalUrl(status.job_id, u));
  }

  const raw = ext.car_images ?? ext.carImages;
  if (Array.isArray(raw)) {
    const urls: string[] = [];
    for (const item of raw) {
      if (typeof item === "string") {
        urls.push(toProxyOriginalUrl(status.job_id, item));
      } else if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        const u = o.url ?? o.image_url ?? o.imageUrl;
        if (typeof u === "string") {
          urls.push(toProxyOriginalUrl(status.job_id, u));
        }
      }
    }
    if (urls.length) {
      return urls;
    }
  }

  return [];
}

function pickPositiveInt(
  ext: Record<string, unknown>,
  keys: string[]
): number | undefined {
  for (const key of keys) {
    const v = ext[key];
    if (typeof v === "number" && Number.isFinite(v) && v >= 1) {
      return Math.floor(v);
    }
  }
  return undefined;
}

function resolveOutputCount(status: JobStatusResponse): number {
  const fromUrls = extractResultUrlsFromStatus(status);
  if (fromUrls.length > 0) {
    return fromUrls.length;
  }
  const ext = status as unknown as Record<string, unknown>;
  const n =
    pickPositiveInt(ext, [
      "output_count",
      "outputCount",
      "result_count",
      "resultCount",
      "num_outputs",
      "numOutputs",
      "variations",
      "variation_count",
    ]) ?? (typeof status.output_count === "number" ? status.output_count : undefined);
  if (typeof n === "number" && n >= 1) {
    return Math.floor(n);
  }
  return 1;
}

function resolveOriginalCount(status: JobStatusResponse): number {
  const fromUrls = extractOriginalUrlsFromStatus(status);
  if (fromUrls.length > 0) {
    return fromUrls.length;
  }
  const ext = status as unknown as Record<string, unknown>;
  const n =
    pickPositiveInt(ext, [
      "original_count",
      "originalCount",
      "car_count",
      "carCount",
      "num_originals",
    ]) ?? (typeof status.original_count === "number" ? status.original_count : undefined);
  if (typeof n === "number" && n >= 1) {
    return Math.floor(n);
  }
  return 1;
}

function buildOutputs(status: JobStatusResponse): JobOutput[] {
  if (status.status !== "completed" || !status.result_ready) {
    return [];
  }

  const jobId = status.job_id;
  const finishedAt = status.finished_at ?? new Date().toISOString();
  const urls = extractResultUrlsFromStatus(status);

  if (urls.length > 0) {
    return urls.map((imageUrl, i) => ({
      id: `${jobId}-result-${i}`,
      imageUrl,
      createdAt: finishedAt,
    }));
  }

  const count = resolveOutputCount(status);
  if (count > 1) {
    return Array.from({ length: count }, (_, i) => ({
      id: `${jobId}-result-${i}`,
      imageUrl: resultProxyUrlIndexed(jobId, i),
      createdAt: finishedAt,
    }));
  }

  return [
    {
      id: `${jobId}-result`,
      imageUrl: resultProxyUrl(jobId),
      createdAt: finishedAt,
    },
  ];
}

function buildCarImages(
  status: JobStatusResponse,
  meta?: LocalJobMetadata
): StoredImage[] {
  if (meta?.carImage) {
    return [meta.carImage];
  }

  const urls = extractOriginalUrlsFromStatus(status);
  if (urls.length > 0) {
    return urls.map((dataUrl, i) => ({
      id: `${status.job_id}-car-${i}`,
      name: `Original car ${i + 1}`,
      dataUrl,
      size: 0,
      type: "image/jpeg",
    }));
  }

  const count = resolveOriginalCount(status);
  if (count > 1) {
    return Array.from({ length: count }, (_, i) => ({
      id: `${status.job_id}-car-${i}`,
      name: `Original car ${i + 1}`,
      dataUrl: originalProxyUrlIndexed(status.job_id, i),
      size: 0,
      type: "image/jpeg",
    }));
  }

  return [
    {
      id: `${status.job_id}-car-original`,
      name: "Original car",
      dataUrl: originalProxyUrl(status.job_id),
      size: 0,
      type: "image/jpeg",
    },
  ];
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
    carImages: buildCarImages(status, meta),
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
