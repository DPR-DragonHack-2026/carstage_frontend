import { APP_STORAGE_KEYS } from "@/lib/utils";
import type { StoredImage } from "@/types/carstage";

export interface LocalJobMetadata {
  jobId: string;
  title: string;
  createdAt: string;
  carImage: StoredImage;
  logo?: StoredImage;
  licensePlate?: string;
  selectedBackgroundId: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readAll(): LocalJobMetadata[] {
  if (!isBrowser()) {
    return [];
  }
  const raw = window.localStorage.getItem(APP_STORAGE_KEYS.jobs);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return (parsed as LocalJobMetadata[]).filter(
      (entry) => typeof entry?.jobId === "string"
    );
  } catch {
    return [];
  }
}

function writeAll(records: LocalJobMetadata[]): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(APP_STORAGE_KEYS.jobs, JSON.stringify(records));
}

export function listLocalJobs(): LocalJobMetadata[] {
  return readAll().sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export function getLocalJob(jobId: string): LocalJobMetadata | undefined {
  return readAll().find((entry) => entry.jobId === jobId);
}

export function saveLocalJob(record: LocalJobMetadata): void {
  const others = readAll().filter((entry) => entry.jobId !== record.jobId);
  writeAll([record, ...others]);
}

export function removeLocalJob(jobId: string): void {
  writeAll(readAll().filter((entry) => entry.jobId !== jobId));
}
