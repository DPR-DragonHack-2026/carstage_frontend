import type { NextRequest } from "next/server";
import {
  callUpstream,
  jsonError,
  readUpstreamErrorDetail,
} from "@/lib/api/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Request must be multipart/form-data with 'car' and 'bg'.", 400);
  }

  const car = formData.get("car");
  const bg = formData.get("bg");

  if (!(car instanceof File) || !(bg instanceof File)) {
    return jsonError("Both 'car' and 'bg' file fields are required.", 400);
  }

  const upstreamForm = new FormData();
  upstreamForm.set("car", car, car.name || "car.jpg");
  upstreamForm.set("bg", bg, bg.name || "bg.jpg");

  let upstream: Response;
  try {
    upstream = await callUpstream({
      method: "POST",
      path: "/jobs",
      body: upstreamForm,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    return jsonError(`Failed to reach showroom backend: ${message}`, 502);
  }

  if (!upstream.ok) {
    const detail = await readUpstreamErrorDetail(upstream);
    return jsonError(detail, upstream.status);
  }

  const payload = await upstream.json();
  return Response.json(payload, { status: 200 });
}

export async function GET(): Promise<Response> {
  let upstream: Response;
  try {
    upstream = await callUpstream({ method: "GET", path: "/jobs" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    return jsonError(`Failed to reach showroom backend: ${message}`, 502);
  }

  if (!upstream.ok) {
    const detail = await readUpstreamErrorDetail(upstream);
    return jsonError(detail, upstream.status);
  }

  const payload = await upstream.json();
  return Response.json(payload);
}
