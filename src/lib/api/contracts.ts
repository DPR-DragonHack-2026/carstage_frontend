import type {
  BackgroundOption,
  CreateJobPayload,
  GenerationJob,
} from "@/types/carstage";

export interface JobService {
  listBackgrounds(): Promise<BackgroundOption[]>;
  listJobs(): Promise<GenerationJob[]>;
  getJobById(jobId: string): Promise<GenerationJob | null>;
  createJob(payload: CreateJobPayload): Promise<GenerationJob>;
}
