import type { NextRequest } from "next/server";
import {
  callUpstream,
  jsonError,
  readUpstreamErrorDetail,
} from "@/lib/api/proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/showroom/jobs/[jobId]">
): Promise<Response> {
  const { jobId } = await context.params;
  if (!jobId) {
    return jsonError("Missing jobId.", 400);
  }

  let upstream: Response;
  try {
    upstream = await callUpstream({
      method: "GET",
      path: `/jobs/${encodeURIComponent(jobId)}`,
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
  return Response.json(payload);
}
