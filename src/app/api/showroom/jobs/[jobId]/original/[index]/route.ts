import type { NextRequest } from "next/server";
import {
  callUpstream,
  jsonError,
  readUpstreamErrorDetail,
} from "@/lib/api/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PASSTHROUGH_HEADERS = ["content-type", "content-length", "etag"];

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/showroom/jobs/[jobId]/original/[index]">
): Promise<Response> {
  const { jobId, index } = await context.params;
  if (!jobId || index === undefined) {
    return jsonError("Missing jobId or index.", 400);
  }

  let upstream: Response;
  try {
    upstream = await callUpstream({
      method: "GET",
      path: `/jobs/${encodeURIComponent(jobId)}/original/${encodeURIComponent(index)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    return jsonError(`Failed to reach showroom backend: ${message}`, 502);
  }

  if (!upstream.ok) {
    const detail = await readUpstreamErrorDetail(upstream);
    return jsonError(detail, upstream.status);
  }

  if (!upstream.body) {
    return jsonError("Upstream returned an empty body.", 502);
  }

  const headers = new Headers();
  for (const name of PASSTHROUGH_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/octet-stream");
  }
  headers.set("cache-control", "private, max-age=0, must-revalidate");

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
