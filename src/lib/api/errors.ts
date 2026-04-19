/**
 * Turn the renderer's raw `error` string from a failed JobStatusResponse into
 * something a human can act on. The backend sometimes returns tuple-like reprs
 * (e.g. `(0, '')`) or single-character codes that mean nothing on their own.
 */
export function formatRendererError(detail?: string | null): string {
  const trimmed = detail?.trim();
  if (!trimmed) {
    return "The renderer reported a failure but did not return a reason. Please try again.";
  }

  const looksCryptic =
    /^[\s(){}\[\]'",.0-9-]+$/.test(trimmed) || trimmed.length < 4;
  if (looksCryptic) {
    return `The renderer returned an unhelpful error (${trimmed}). Try generating again - this is usually transient.`;
  }

  return `Generation failed: ${trimmed}`;
}
