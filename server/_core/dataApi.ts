/**
 * Data API — Standalone (no Manus Forge dependency).
 * Provides a generic HTTP API caller for external services.
 */

export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

/**
 * Generic API caller — can be used for any external REST API.
 * No longer depends on Manus Forge proxy.
 */
export async function callDataApi(
  apiUrl: string,
  options: DataApiCallOptions = {}
): Promise<unknown> {
  const url = new URL(apiUrl);

  // Add query params
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString(), {
    method: options.body ? "POST" : "GET",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `API request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
    );
  }

  return response.json().catch(() => ({}));
}
