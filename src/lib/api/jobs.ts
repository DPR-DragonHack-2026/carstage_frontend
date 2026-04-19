import { mockBackgrounds } from "@/lib/mocks/backgrounds";
import type { JobService } from "@/lib/api/contracts";
import {
  syntheticQueuedJob,
  toGenerationJob,
  type BackendJobStatus,
  type JobCreateResponse,
  type JobStatusResponse,
} from "@/lib/api/job-mapping";
import {
  getLocalJob,
  listLocalJobs,
  removeLocalJob,
  saveLocalJob,
  type LocalJobMetadata,
  type LocalJobTerminalStatus,
} from "@/lib/api/job-store";
import type {
  BackgroundOption,
  CreateJobPayload,
  GenerationJob,
  StoredImage,
} from "@/types/carstage";

const PROXY_BASE = "/api/showroom";

export class ShowroomApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ShowroomApiError";
  }
}

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.error === "string") {
      return data.error;
    }
    if (typeof data?.detail === "string") {
      return data.detail;
    }
    return JSON.stringify(data);
  } catch {
    return response.statusText || "Request failed";
  }
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error("Could not read uploaded car image.");
  }
  return response.blob();
}

function fileNameFor(image: StoredImage, fallback: string): string {
  const trimmed = image.name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

async function fetchBackgroundBlob(
  background: BackgroundOption
): Promise<{ blob: Blob; fileName: string }> {
  const response = await fetch(background.imageUrl);
  if (!response.ok) {
    throw new Error(
      `Could not load background "${background.name}" (${response.status}).`
    );
  }
  const blob = await response.blob();
  const segments = background.imageUrl.split("/");
  const fileName = segments[segments.length - 1] || "background.jpg";
  return { blob, fileName };
}

function resolveBackground(
  selectedBackgroundIds: string[]
): BackgroundOption {
  const id = selectedBackgroundIds[0];
  if (!id) {
    throw new Error("Pick a background before generating.");
  }
  const background = mockBackgrounds.find((entry) => entry.id === id);
  if (!background) {
    throw new Error(`Unknown background "${id}".`);
  }
  return background;
}

async function postCreateJob(
  carImage: StoredImage,
  background: BackgroundOption
): Promise<JobCreateResponse> {
  const carBlob = await dataUrlToBlob(carImage.dataUrl);
  const { blob: bgBlob, fileName: bgFileName } = await fetchBackgroundBlob(
    background
  );

  const formData = new FormData();
  formData.set("car", carBlob, fileNameFor(carImage, "car.jpg"));
  formData.set("bg", bgBlob, bgFileName);

  const response = await fetch(`${PROXY_BASE}/jobs`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new ShowroomApiError(await readError(response), response.status);
  }

  return (await response.json()) as JobCreateResponse;
}

async function fetchJobStatus(jobId: string): Promise<JobStatusResponse> {
  const response = await fetch(
    `${PROXY_BASE}/jobs/${encodeURIComponent(jobId)}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new ShowroomApiError(await readError(response), response.status);
  }
  return (await response.json()) as JobStatusResponse;
}

function isTerminalStatus(
  status: JobStatusResponse["status"]
): status is LocalJobTerminalStatus {
  return status === "completed" || status === "failed";
}

/**
 * If the backend reports a terminal state, snapshot it onto the local record so
 * future history loads can recover the same status even after the backend
 * evicts the job (404s on subsequent fetches).
 */
function cacheTerminalStatus(
  meta: LocalJobMetadata | undefined,
  status: JobStatusResponse
): void {
  if (!meta || !isTerminalStatus(status.status)) {
    return;
  }
  if (
    meta.lastKnownStatus === status.status &&
    meta.lastKnownFinishedAt === (status.finished_at ?? undefined) &&
    meta.lastKnownError === (status.error ?? undefined)
  ) {
    return;
  }
  saveLocalJob({
    ...meta,
    lastKnownStatus: status.status,
    lastKnownFinishedAt: status.finished_at ?? undefined,
    lastKnownError: status.error ?? undefined,
  });
}

/**
 * Reconstruct a JobStatusResponse from the locally cached snapshot, used when
 * the backend can no longer answer for this job_id.
 */
function fallbackStatusFromCache(
  meta: LocalJobMetadata
): JobStatusResponse {
  const cached = meta.lastKnownStatus;
  if (cached === "completed") {
    return {
      job_id: meta.jobId,
      status: "completed",
      queue_position: 0,
      queued_count: 0,
      created_at: meta.createdAt,
      finished_at: meta.lastKnownFinishedAt ?? meta.createdAt,
      result_ready: true,
    };
  }
  if (cached === "failed") {
    return {
      job_id: meta.jobId,
      status: "failed",
      queue_position: 0,
      queued_count: 0,
      created_at: meta.createdAt,
      finished_at: meta.lastKnownFinishedAt ?? meta.createdAt,
      error: meta.lastKnownError,
      result_ready: false,
    };
  }
  return {
    job_id: meta.jobId,
    status: "queued",
    queue_position: 0,
    queued_count: 0,
    created_at: meta.createdAt,
    result_ready: false,
  };
}

export async function listBackgrounds(): Promise<BackgroundOption[]> {
  return mockBackgrounds;
}

function extractJobsArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    for (const key of ["jobs", "items", "data", "results"]) {
      const v = o[key];
      if (Array.isArray(v)) {
        return v;
      }
    }
  }
  return [];
}

function coerceStringArray(
  row: Record<string, unknown>,
  keys: string[]
): string[] | undefined {
  for (const key of keys) {
    const v = row[key];
    if (Array.isArray(v)) {
      const urls = v.filter((x): x is string => typeof x === "string");
      if (urls.length) {
        return urls;
      }
    }
  }
  return undefined;
}

function coercePositiveInt(
  row: Record<string, unknown>,
  keys: string[]
): number | undefined {
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "number" && Number.isFinite(v) && v >= 1) {
      return Math.floor(v);
    }
  }
  return undefined;
}

function coerceJobStatusRow(
  row: Record<string, unknown>
): JobStatusResponse | null {
  const jobId =
    typeof row.job_id === "string"
      ? row.job_id
      : typeof row.jobId === "string"
        ? row.jobId
        : null;
  if (!jobId) {
    return null;
  }

  const raw = row.status;
  const status: BackendJobStatus =
    raw === "queued" ||
    raw === "running" ||
    raw === "completed" ||
    raw === "failed"
      ? raw
      : "queued";

  const qp = row.queue_position ?? row.queuePosition;
  const qc = row.queued_count ?? row.queuedCount;

  const createdAt =
    typeof row.created_at === "string"
      ? row.created_at
      : typeof row.createdAt === "string"
        ? row.createdAt
        : new Date().toISOString();

  return {
    job_id: jobId,
    status,
    queue_position: typeof qp === "number" ? qp : 0,
    queued_count: typeof qc === "number" ? qc : 0,
    run_id: (row.run_id ?? row.runId) as string | null | undefined,
    model: (row.model as string | null | undefined) ?? null,
    created_at: createdAt,
    started_at: (row.started_at ?? row.startedAt) as string | null | undefined,
    finished_at: (row.finished_at ?? row.finishedAt) as string | null | undefined,
    error: (row.error as string | null | undefined) ?? null,
    result_ready: Boolean(row.result_ready ?? row.resultReady),
    result_urls: coerceStringArray(row, [
      "result_urls",
      "resultUrls",
      "output_urls",
      "outputUrls",
    ]),
    original_urls: coerceStringArray(row, [
      "original_urls",
      "originalUrls",
      "car_urls",
      "carUrls",
    ]),
    output_count: coercePositiveInt(row, [
      "output_count",
      "outputCount",
      "result_count",
      "resultCount",
      "num_outputs",
      "numOutputs",
      "variations",
    ]),
    original_count: coercePositiveInt(row, [
      "original_count",
      "originalCount",
      "car_count",
      "carCount",
    ]),
    outputs: row.outputs ?? row.Outputs,
  };
}

async function resolveJobsFromListPayload(
  payload: unknown
): Promise<JobStatusResponse[]> {
  const rows = extractJobsArray(payload);
  const direct: JobStatusResponse[] = [];
  const idOnly: string[] = [];

  for (const row of rows) {
    if (typeof row === "string") {
      idOnly.push(row);
    } else if (row && typeof row === "object") {
      const coerced = coerceJobStatusRow(row as Record<string, unknown>);
      if (coerced) {
        direct.push(coerced);
      }
    }
  }

  const fetched = await Promise.all(
    idOnly.map(async (id) => {
      try {
        return await fetchJobStatus(id);
      } catch {
        return null;
      }
    })
  );

  return [...direct, ...(fetched.filter(Boolean) as JobStatusResponse[])];
}

async function fetchJobsListFromApi(): Promise<JobStatusResponse[] | null> {
  try {
    const response = await fetch(`${PROXY_BASE}/jobs`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    return await resolveJobsFromListPayload(payload);
  } catch {
    return null;
  }
}

export async function listJobs(): Promise<GenerationJob[]> {
  const remoteList = await fetchJobsListFromApi();

  const local = listLocalJobs();
  const localById = new Map(local.map((m) => [m.jobId, m]));

  const remoteById = new Map<string, JobStatusResponse>();
  if (remoteList) {
    for (const status of remoteList) {
      remoteById.set(status.job_id, status);
    }
  }

  const allIds = new Set<string>([
    ...remoteById.keys(),
    ...local.map((m) => m.jobId),
  ]);

  if (!allIds.size) {
    return [];
  }

  const enriched = await Promise.all(
    [...allIds].map(async (jobId) => {
      const meta = localById.get(jobId);
      const fromList = remoteById.get(jobId);

      if (fromList) {
        cacheTerminalStatus(meta, fromList);
        try {
          const fresh = await fetchJobStatus(jobId);
          cacheTerminalStatus(meta, fresh);
          return toGenerationJob(fresh, meta);
        } catch {
          return toGenerationJob(fromList, meta);
        }
      }

      try {
        const status = await fetchJobStatus(jobId);
        cacheTerminalStatus(meta, status);
        return toGenerationJob(status, meta);
      } catch {
        if (meta) {
          return toGenerationJob(fallbackStatusFromCache(meta), meta);
        }
        return null;
      }
    })
  );

  const valid = enriched.filter((j): j is GenerationJob => j !== null);

  return valid.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export async function getJobById(jobId: string): Promise<GenerationJob | null> {
  const meta = getLocalJob(jobId);
  try {
    const status = await fetchJobStatus(jobId);
    cacheTerminalStatus(meta, status);
    return toGenerationJob(status, meta);
  } catch (error) {
    if (error instanceof ShowroomApiError && error.status === 404) {
      if (!meta) {
        return null;
      }
      // Backend forgot the job. Prefer the cached terminal snapshot if we have
      // one (e.g. a previously completed render stays at 100%); only fall back
      // to a synthesized "lost" failure when we have nothing better.
      if (meta.lastKnownStatus) {
        return toGenerationJob(fallbackStatusFromCache(meta), meta);
      }
      return toGenerationJob(
        {
          job_id: jobId,
          status: "failed",
          queue_position: 0,
          queued_count: 0,
          created_at: meta.createdAt,
          result_ready: false,
          error: "Job not found on the backend.",
        },
        meta
      );
    }
    throw error;
  }
}

export async function createJob(
  payload: CreateJobPayload
): Promise<GenerationJob> {
  if (!payload.carImages.length) {
    throw new Error("At least one car image is required.");
  }
  if (payload.selectedBackgroundIds.length !== 1) {
    throw new Error("Pick exactly one background.");
  }

  const carImage = payload.carImages[0];
  const background = resolveBackground(payload.selectedBackgroundIds);

  const created = await postCreateJob(carImage, background);

  const meta: LocalJobMetadata = {
    jobId: created.job_id,
    title:
      payload.title.trim() ||
      `Job ${new Date().toLocaleDateString()}`,
    createdAt: new Date().toISOString(),
    carImage,
    logo: payload.logo,
    licensePlate: payload.licensePlate?.trim() || undefined,
    selectedBackgroundId: background.id,
  };
  saveLocalJob(meta);

  return syntheticQueuedJob(created, meta);
}

export async function deleteJob(jobId: string): Promise<void> {
  const response = await fetch(
    `${PROXY_BASE}/jobs/${encodeURIComponent(jobId)}`,
    { method: "DELETE" }
  );

  if (response.status === 204 || response.status === 404) {
    // 204: backend confirmed deletion. 404: backend already lost it.
    // Either way, drop our local copy.
    removeLocalJob(jobId);
    return;
  }

  if (response.status === 409) {
    throw new ShowroomApiError(
      "This job is still running. Wait for it to finish before deleting.",
      409
    );
  }

  throw new ShowroomApiError(await readError(response), response.status);
}

export const httpJobService: JobService = {
  listBackgrounds,
  listJobs,
  getJobById,
  createJob,
  deleteJob,
};

export const jobService: JobService = httpJobService;
