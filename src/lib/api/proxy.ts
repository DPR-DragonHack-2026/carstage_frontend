import { buildUpstreamHeaders, getShowroomConfig } from "@/lib/api/config";

export interface UpstreamCallOptions {
  method?: string;
  path: string;
  body?: BodyInit;
  headers?: HeadersInit;
}

export async function callUpstream({
  method = "GET",
  path,
  body,
  headers,
}: UpstreamCallOptions): Promise<Response> {
  const { baseUrl } = getShowroomConfig();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, {
    method,
    body,
    headers: buildUpstreamHeaders(headers),
    cache: "no-store",
    redirect: "follow",
  });
}

export async function readUpstreamErrorDetail(response: Response): Promise<string> {
  try {
    const data = await response.clone().json();
    if (typeof data?.detail === "string") {
      return data.detail;
    }
    if (Array.isArray(data?.detail) && data.detail.length) {
      const first = data.detail[0];
      if (first?.msg) {
        return String(first.msg);
      }
    }
    return JSON.stringify(data);
  } catch {
    try {
      return await response.text();
    } catch {
      return response.statusText || "Upstream error";
    }
  }
}

export function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}
