import { createClient } from "@supabase/supabase-js";

// Browser Supabase client (anon key). Used ONLY to upload to a server-issued
// signed upload URL — the token authorizes the write, no user session needed.
const browserClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  { auth: { persistSession: false } },
);

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "uploads";

/**
 * Upload a file directly from the browser to Supabase Storage using a signed
 * upload token minted by `insights.createImageUploadUrl`. Bytes skip our server.
 */
export async function uploadToSignedUrl(path: string, token: string, file: File): Promise<void> {
  const { error } = await browserClient.storage.from(BUCKET).uploadToSignedUrl(path, token, file, {
    contentType: file.type,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
}
