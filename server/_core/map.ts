/**
 * Google Maps API Integration — Standalone (no Manus Forge proxy).
 * Uses Google Maps API directly with API key.
 */

export type LatLng = { lat: number; lng: number };

/**
 * Make requests to Google Maps APIs directly.
 * Requires GOOGLE_MAPS_API_KEY environment variable.
 */
export async function makeRequest<T = unknown>(
  endpoint: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }

  const url = new URL(`https://maps.googleapis.com${endpoint}`);
  url.searchParams.append("key", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Maps API failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as T;
}
