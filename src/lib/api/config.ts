export interface ShowroomConfig {
  baseUrl: string;
  apiKey?: string;
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getShowroomConfig(): ShowroomConfig {
  const baseUrl = process.env.SHOWROOM_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "SHOWROOM_API_BASE_URL is not set. Add it to .env.local before calling the showroom proxy."
    );
  }

  const apiKey = process.env.SHOWROOM_API_KEY?.trim() || undefined;

  return {
    baseUrl: trimTrailingSlash(baseUrl),
    apiKey,
  };
}

export function buildUpstreamHeaders(extra?: HeadersInit): Headers {
  const { apiKey } = getShowroomConfig();
  const headers = new Headers(extra);
  headers.set("ngrok-skip-browser-warning", "1");
  if (!headers.has("user-agent")) {
    headers.set("user-agent", "carstage-frontend-proxy");
  }
  if (apiKey) {
    headers.set("X-API-Key", apiKey);
  }
  return headers;
}
