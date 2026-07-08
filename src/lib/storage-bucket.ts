import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

// Server-only client using the service role key — never import this into client components.
function getClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("Supabase Storage not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export interface UploadResult {
  storagePath: string;
  publicUrl: string;
}

/** Upload a file buffer to Supabase Storage and return its path + public URL. */
export async function uploadToBucket(
  file: Buffer | Uint8Array,
  opts: { filename: string; contentType: string; prefix?: string },
): Promise<UploadResult> {
  const client = getClient();
  const ext = opts.filename.includes(".") ? opts.filename.split(".").pop() : undefined;
  const key = `${opts.prefix ?? "insights"}/${randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error } = await client.storage.from(BUCKET).upload(key, file, {
    contentType: opts.contentType,
    upsert: false,
  });
  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = client.storage.from(BUCKET).getPublicUrl(key);
  return { storagePath: key, publicUrl: data.publicUrl };
}

export async function deleteFromBucket(storagePath: string): Promise<void> {
  const client = getClient();
  const { error } = await client.storage.from(BUCKET).remove([storagePath]);
  if (error) throw new Error(`Supabase delete failed: ${error.message}`);
}

export interface SignedUpload {
  path: string;
  token: string;
  publicUrl: string;
}

/**
 * Create a signed upload URL so the BROWSER can upload bytes directly to Supabase
 * Storage (the S3 presigned-PUT pattern) — the file never passes through our server.
 * Returns the storage path, a single-use upload token, and the eventual public URL.
 */
export async function createSignedUpload(opts: { filename: string; prefix?: string }): Promise<SignedUpload> {
  const client = getClient();
  const ext = opts.filename.includes(".") ? opts.filename.split(".").pop() : undefined;
  const path = `${opts.prefix ?? "insights"}/${randomUUID()}${ext ? `.${ext}` : ""}`;

  const { data, error } = await client.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(`Failed to create signed upload URL: ${error?.message}`);

  const { data: pub } = client.storage.from(BUCKET).getPublicUrl(path);
  return { path, token: data.token, publicUrl: pub.publicUrl };
}
