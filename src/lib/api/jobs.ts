import { mockBackgrounds } from "@/lib/mocks/backgrounds";
import { APP_STORAGE_KEYS, createId, wait } from "@/lib/utils";
import type { JobService } from "@/lib/api/contracts";
import type {
  BackgroundOption,
  CreateJobPayload,
  GenerationJob,
  JobOutput,
} from "@/types/carstage";

const OUTPUTS_PER_JOB = 6;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJobs(): GenerationJob[] {
  if (!isBrowser()) {
    return [];
  }
  const raw = window.localStorage.getItem(APP_STORAGE_KEYS.jobs);
  if (!raw) {
    return [];
  }
  try {
    const jobs = JSON.parse(raw) as GenerationJob[];
    return jobs.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  } catch {
    return [];
  }
}

function writeJobs(jobs: GenerationJob[]): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(APP_STORAGE_KEYS.jobs, JSON.stringify(jobs));
}

function generateMockOutputs(jobId: string): JobOutput[] {
  const createdAt = new Date().toISOString();
  return Array.from({ length: OUTPUTS_PER_JOB }).map((_, index) => ({
    id: createId(`output-${index + 1}`),
    imageUrl: `https://picsum.photos/seed/${jobId}-${index + 1}/1280/720`,
    createdAt,
  }));
}

export async function listBackgrounds(): Promise<BackgroundOption[]> {
  await wait(150);
  return mockBackgrounds;
}

export async function listJobs(): Promise<GenerationJob[]> {
  await wait(200);
  return readJobs();
}

export async function getJobById(jobId: string): Promise<GenerationJob | null> {
  await wait(120);
  const job = readJobs().find((item) => item.id === jobId);
  return job ?? null;
}

export async function createJob(payload: CreateJobPayload): Promise<GenerationJob> {
  if (!payload.carImages.length) {
    throw new Error("At least one car image is required.");
  }
  if (!payload.selectedBackgroundIds.length) {
    throw new Error("At least one background must be selected.");
  }

  const now = new Date().toISOString();
  const job: GenerationJob = {
    id: createId("job"),
    title: payload.title.trim() || `Job ${new Date().toLocaleDateString()}`,
    status: "queued",
    progress: 10,
    createdAt: now,
    updatedAt: now,
    carImages: payload.carImages,
    logo: payload.logo,
    licensePlate: payload.licensePlate?.trim() || undefined,
    selectedBackgroundIds: payload.selectedBackgroundIds,
    outputs: [],
  };

  const jobs = readJobs();
  writeJobs([job, ...jobs]);

  await wait(300);
  const processing: GenerationJob = {
    ...job,
    status: "processing",
    progress: 55,
    updatedAt: new Date().toISOString(),
  };
  writeJobs([processing, ...jobs]);

  await wait(700);
  const completed: GenerationJob = {
    ...processing,
    status: "completed",
    progress: 100,
    outputs: generateMockOutputs(job.id),
    updatedAt: new Date().toISOString(),
  };
  writeJobs([completed, ...jobs]);

  return completed;
}

export const mockJobService: JobService = {
  listBackgrounds,
  listJobs,
  getJobById,
  createJob,
};

export const jobService: JobService = mockJobService;
