export const APP_STORAGE_KEYS = {
  session: "carstage.mock.session",
  jobs: "carstage.mock.jobs",
} as const;

export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  const stamp = Date.now().toString(36);
  return `${prefix}-${stamp}-${random}`;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function bytesToReadable(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
