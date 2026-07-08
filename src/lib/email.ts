import { Resend } from "resend";
import { storage } from "@/lib/queries";

const FROM_EMAIL = process.env.RESEND_FROM || "Vajira Weerasekera <noreply@vajiraweerasekera.com>";

/** Whether Resend credentials are present. Lets callers report a clear
 * "no email service configured" state instead of a silent failure. */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — emails will not be sent.");
    return null;
  }
  return new Resend(apiKey);
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  bcc?: string;
}

export interface SendResult {
  ok: boolean;
  /** Human-readable failure reason when ok is false (shown in the Email Log). */
  error?: string;
}

/** Low-level send. Returns { ok, error }. Does not log. */
export async function sendEmail(options: SendEmailOptions): Promise<SendResult> {
  const resend = getResend();
  if (!resend) return { ok: false, error: "No Resend API key configured (RESEND_API_KEY is not set)." };

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      ...(options.bcc ? { bcc: [options.bcc] } : {}),
    });
    if (error) {
      console.error("[email] Send error:", error);
      return { ok: false, error: error.message || error.name || "Resend rejected the request." };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Unknown send error." };
  }
}

/** Send + write an audit row to email_logs (powers the admin Email Log tab). */
export async function sendTrackedEmail(
  options: SendEmailOptions & { trigger: string; preview?: string },
): Promise<boolean> {
  const { ok, error } = await sendEmail(options);
  try {
    await storage.logEmail({
      to: options.to,
      subject: options.subject,
      trigger: options.trigger,
      preview: options.preview ?? null,
      success: ok,
      error: ok ? null : (error ?? "Unknown error"),
      htmlBody: options.html,
      textBody: options.text ?? null,
    });
  } catch (err) {
    console.error("[email] Failed to write email log:", err);
  }
  return ok;
}
