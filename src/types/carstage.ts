export type JobStatus = "draft" | "queued" | "processing" | "completed" | "failed";

export interface BackgroundOption {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
}

export interface StoredImage {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  type: string;
}

export interface JobOutput {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export interface GenerationJob {
  id: string;
  title: string;
  status: JobStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  carImages: StoredImage[];
  logo?: StoredImage;
  licensePlate?: string;
  selectedBackgroundIds: string[];
  outputs: JobOutput[];
  errorMessage?: string;
  queuePosition?: number;
}

export interface CreateJobPayload {
  title: string;
  carImages: StoredImage[];
  logo?: StoredImage;
  licensePlate?: string;
  selectedBackgroundIds: string[];
}
