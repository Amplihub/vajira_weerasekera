import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { storage } from "@/lib/queries";
import { formSubmissionTypes } from "@/db/schema";

export const runtime = "nodejs";

// GoHighLevel posts form submissions here. GHL's outbound webhook is configured to
// include the shared secret (header `x-ghl-secret` or `?secret=`). We verify it,
// then store the full raw payload idempotently in `form_submissions` (keyed by GHL's
// submission id). Nothing is lost regardless of how GHL names its fields; the coach
// reviews submissions in the admin inbox and clicks "Convert to client".
//
// NOTE: confirm the real GHL field names with the GHL expert, then refine `pick()`.

function verifySecret(req: NextRequest): boolean {
  const expected = process.env.GHL_WEBHOOK_SECRET;
  if (!expected) return false;
  // Accept any of: custom header `x-ghl-secret`, `Authorization: Bearer <secret>`,
  // or `?secret=` — whichever GHL's webhook config can send.
  const authHeader = req.headers.get("authorization") ?? "";
  const bearer = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
  const provided = req.headers.get("x-ghl-secret") || bearer || req.nextUrl.searchParams.get("secret") || "";
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Lightweight in-memory rate limit (per warm instance). Real protection comes from
// the shared secret; this just blunts accidental floods / retries storms.
const HITS = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = HITS.get(key);
  if (!entry || now > entry.resetAt) {
    HITS.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

type Payload = Record<string, unknown>;

function str(payload: Payload, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = payload[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function normalizeType(raw?: string): string {
  if (!raw) return "other";
  const t = raw.toLowerCase();
  if (t.includes("coach") || t.includes("application")) return "coaching_application";
  if (t.includes("speak")) return "speaking";
  if (t.includes("book") || t.includes("call")) return "booking";
  if (t.includes("contact")) return "contact";
  return (formSubmissionTypes as readonly string[]).includes(t) ? t : "other";
}

export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ghlSubmissionId = str(payload, "submissionId", "submission_id", "id", "contactId");
  if (!ghlSubmissionId) {
    return NextResponse.json({ error: "Missing submission id" }, { status: 400 });
  }

  const email = str(payload, "email", "Email", "contact_email");
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const submission = await storage.upsertFormSubmission({
      ghlSubmissionId,
      formType: normalizeType(str(payload, "formType", "form_type", "form", "type")),
      fullName: str(payload, "fullName", "full_name", "name") ?? null,
      email,
      phone: str(payload, "phone", "phoneNumber") ?? null,
      company: str(payload, "company", "organization") ?? null,
      role: str(payload, "role", "title", "roleTitle") ?? null,
      message: str(payload, "message", "notes", "comments") ?? null,
      rawPayload: payload,
    });
    return NextResponse.json({ ok: true, id: submission.id }, { status: 200 });
  } catch (err) {
    console.error("[ghl-webhook] Failed to store submission:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
