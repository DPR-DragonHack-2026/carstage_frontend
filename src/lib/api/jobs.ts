import { mockBackgrounds } from "@/lib/mocks/backgrounds";
import type { JobService } from "@/lib/api/contracts";
import {
  syntheticQueuedJob,
  toGenerationJob,
  type JobCreateResponse,
  type JobStatusResponse,
} from "@/lib/api/job-mapping";
import {
  getLocalJob,
  listLocalJobs,
  removeLocalJob,
  saveLocalJob,
  type LocalJobMetadata,
} from "@/lib/api/job-store";
import type {
  BackgroundOption,
  CreateJobPayload,
  GenerationJob,
  StoredImage,
} from "@/types/carstage";

const PROXY_BASE = "/api/showroom";

class ShowroomApiError extends Error {
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

export async function listBackgrounds(): Promise<BackgroundOption[]> {
  return mockBackgrounds;
}

export async function listJobs(): Promise<GenerationJob[]> {
  const local = listLocalJobs();
  if (!local.length) {
    return [];
  }

  const enriched = await Promise.all(
    local.map(async (meta) => {
      try {
        const status = await fetchJobStatus(meta.jobId);
        return toGenerationJob(status, meta);
      } catch {
        return toGenerationJob(
          {
            job_id: meta.jobId,
            status: "queued",
            queue_position: 0,
            queued_count: 0,
            created_at: meta.createdAt,
            result_ready: false,
          },
          meta
        );
      }
    })
  );

  return enriched.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export async function getJobById(jobId: string): Promise<GenerationJob | null> {
  const meta = getLocalJob(jobId);
  try {
    const status = await fetchJobStatus(jobId);
    return toGenerationJob(status, meta);
  } catch (error) {
    if (error instanceof ShowroomApiError && error.status === 404) {
      return meta
        ? toGenerationJob(
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
          )
        : null;
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
  removeLocalJob(jobId);
}

export const httpJobService: JobService = {
  listBackgrounds,
  listJobs,
  getJobById,
  createJob,
  deleteJob,
};

export const jobService: JobService = httpJobService;
