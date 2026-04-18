import { createId } from "@/lib/utils";
import type { StoredImage } from "@/types/carstage";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

export async function toStoredImage(file: File): Promise<StoredImage> {
  const dataUrl = await fileToDataUrl(file);
  return {
    id: createId("upload"),
    name: file.name,
    dataUrl,
    size: file.size,
    type: file.type,
  };
}

export async function toStoredImages(files: File[]): Promise<StoredImage[]> {
  return Promise.all(files.map((file) => toStoredImage(file)));
}
