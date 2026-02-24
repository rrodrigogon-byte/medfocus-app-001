/**
 * Storage Service — Standalone (no Manus Forge dependency).
 * Uses local filesystem for now; can be extended to Google Cloud Storage.
 */
import fs from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/tmp/medfocus-uploads";

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  _contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  ensureUploadDir();
  const key = relKey.replace(/^\/+/, "");
  const filePath = path.join(UPLOAD_DIR, key);

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (typeof data === "string") {
    fs.writeFileSync(filePath, data, "utf-8");
  } else {
    fs.writeFileSync(filePath, data);
  }

  const url = `/uploads/${key}`;
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  return {
    key,
    url: `/uploads/${key}`,
  };
}
