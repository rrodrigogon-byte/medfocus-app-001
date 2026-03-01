/**
 * Storage Service — Google Cloud Storage (GCS)
 * Sprint 51: Substituição de AWS S3 por GCP Cloud Storage
 * Fallback para filesystem local em desenvolvimento
 */
import fs from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/medfocus-uploads";
const GCS_BUCKET = process.env.GCS_BUCKET || "medfocus-uploads";
const USE_GCS = process.env.USE_GCS === "true";

// ── Filesystem fallback (dev) ──────────────────────────────────
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

async function localPut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  _contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  ensureUploadDir();
  const key = relKey.replace(/^\/+/, "");
  const filePath = path.join(UPLOAD_DIR, key);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (typeof data === "string") {
    fs.writeFileSync(filePath, data, "utf-8");
  } else {
    fs.writeFileSync(filePath, data);
  }
  return { key, url: `/uploads/${key}` };
}

async function localGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  return { key, url: `/uploads/${key}` };
}

// ── Google Cloud Storage ───────────────────────────────────────
let gcsStorage: any = null;

async function getGCSClient() {
  if (!gcsStorage) {
    try {
      const { Storage } = await import("@google-cloud/storage");
      gcsStorage = new Storage();
    } catch {
      console.warn("[Storage] @google-cloud/storage not available, falling back to local filesystem");
      return null;
    }
  }
  return gcsStorage;
}

async function gcsPut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const storage = await getGCSClient();
  if (!storage) return localPut(relKey, data, contentType);

  const key = relKey.replace(/^\/+/, "");
  const bucket = storage.bucket(GCS_BUCKET);
  const file = bucket.file(key);

  const buffer = typeof data === "string" ? Buffer.from(data, "utf-8") : Buffer.from(data);

  await file.save(buffer, {
    contentType,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  const url = `https://storage.googleapis.com/${GCS_BUCKET}/${key}`;
  return { key, url };
}

async function gcsGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const url = `https://storage.googleapis.com/${GCS_BUCKET}/${key}`;
  return { key, url };
}

async function gcsDelete(relKey: string): Promise<boolean> {
  const storage = await getGCSClient();
  if (!storage) return false;

  const key = relKey.replace(/^\/+/, "");
  const bucket = storage.bucket(GCS_BUCKET);
  const file = bucket.file(key);

  try {
    await file.delete();
    return true;
  } catch {
    return false;
  }
}

async function gcsGetSignedUrl(relKey: string, expiresInMinutes = 60): Promise<string> {
  const storage = await getGCSClient();
  if (!storage) return `/uploads/${relKey.replace(/^\/+/, "")}`;

  const key = relKey.replace(/^\/+/, "");
  const bucket = storage.bucket(GCS_BUCKET);
  const file = bucket.file(key);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return url;
}

// ── Public API ─────────────────────────────────────────────────
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  if (USE_GCS) return gcsPut(relKey, data, contentType);
  return localPut(relKey, data, contentType);
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  if (USE_GCS) return gcsGet(relKey);
  return localGet(relKey);
}

export async function storageDelete(relKey: string): Promise<boolean> {
  if (USE_GCS) return gcsDelete(relKey);
  // Local delete
  const key = relKey.replace(/^\/+/, "");
  const filePath = path.join(UPLOAD_DIR, key);
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function storageGetSignedUrl(relKey: string, expiresInMinutes = 60): Promise<string> {
  if (USE_GCS) return gcsGetSignedUrl(relKey, expiresInMinutes);
  return `/uploads/${relKey.replace(/^\/+/, "")}`;
}
