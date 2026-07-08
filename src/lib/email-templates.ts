// HTML email templates for the 360 feedback flow.
// Branded to match the site: navy (#081640) → blue (#3d8bf2) gradient header,
// rounded white card, uppercase eyebrows, pill CTA. Email-safe: table layout +
// inline styles + web-safe font stack (custom fonts don't load in mail clients).

import { getAppBaseUrl } from "@/lib/app-url";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function nl2br(str: string): string {
  return escapeHtml(str).replace(/\n/g, "<br>");
}

/** Substitute {{placeholder}} tokens in admin-editable templates (onboarding / nomination). */
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => vars[key] ?? "");
}

// ── Brand constants ──────────────────────────────────────────────────────────
const NAVY = "#081640";
const DEEP = "#0c2f6b";
const BLUE = "#3d8bf2";
const INK = "#0a0f1f";
const INK_WEAK = "#5b6480";
const OUTER_BG = "#eef2fb";
const CARD_BORDER = "#0816401a";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

// Absolute base for image assets (emails can't use relative paths). Uses the
// app's real base URL (NEXT_PUBLIC_APP_URL / Vercel URL) so images resolve to the
// live deployment. Override with EMAIL_ASSET_BASE for local previews (file:// to /public).
const ASSET_BASE = (process.env.EMAIL_ASSET_BASE || getAppBaseUrl()).replace(/\/$/, "");
const IMG = {
  logo: `${ASSET_BASE}/brand/logo-email.png`,
  logoDark: `${ASSET_BASE}/brand/logo-email-dark.png`,
  avatar: `${ASSET_BASE}/brand/vajira-avatar.png`,
  cloud: `${ASSET_BASE}/about/cloud.png`,
  cloudBig: `${ASSET_BASE}/about/cloud-big.png`,
};

/** Wrap inner body HTML in the full branded email document (header band + card + footer). */
function renderDoc(innerHtml: string, preheader = ""): string {
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<meta name="x-apple-disable-message-reformatting"/>
</head>
<body style="margin:0;padding:0;background-color:${OUTER_BG};-webkit-text-size-adjust:100%;">
<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${OUTER_BG};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background-color:#ffffff;border:1px solid ${CARD_BORDER};border-radius:18px;overflow:hidden;">

      <!-- Header: blue-gradient border framing a cloud-image band with the dark logo -->
      <tr><td style="background-color:${NAVY};background-image:linear-gradient(135deg,${NAVY} 0%,${DEEP} 55%,${BLUE} 135%);padding:5px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" background="${IMG.cloudBig}" style="background-color:#dfeaf8;background-image:url('${IMG.cloudBig}');background-size:cover;background-position:center;border-radius:14px;">
          <tr><td style="padding:40px;border-radius:14px;">
            <img src="${IMG.logoDark}" width="160" alt="Vajira Weerasekera" style="display:block;width:160px;height:auto;border:0;outline:none;text-decoration:none;" />
            <div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2px;color:${NAVY};margin-top:12px;text-transform:uppercase;">Leadership Advisory in the AI Era</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:40px;font-family:${FONT};color:${INK};line-height:1.6;">
        ${innerHtml}
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:0 40px 36px 40px;font-family:${FONT};">
        <div style="height:1px;background-color:${CARD_BORDER};margin-bottom:24px;"></div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="top" style="padding-right:16px;">
              <img src="${IMG.avatar}" width="56" alt="Vajira Weerasekera" style="display:block;width:56px;height:auto;border-radius:14px;border:1px solid ${CARD_BORDER};" />
            </td>
            <td valign="middle">
              <div style="font-size:15px;font-weight:600;color:${INK};">Vajira Weerasekera</div>
              <div style="font-size:13px;color:${INK_WEAK};margin-top:3px;">Founder, Veritas Human Edge</div>
              <a href="https://vajiraweerasekera.com" style="display:inline-block;margin-top:8px;font-size:13px;font-weight:600;color:${BLUE};text-decoration:none;letter-spacing:0.3px;">vajiraweerasekera.com</a>
            </td>
          </tr>
        </table>
      </td></tr>

    </table>
    <div style="font-family:${FONT};font-size:11px;color:#9aa3bd;margin-top:18px;">© ${new Date().getFullYear()} Vajira Weerasekera. Confidential.</div>
  </td></tr>
</table>
</body></html>`;
}

/** Uppercase eyebrow label above the greeting. */
function eyebrow(label: string): string {
  return `<div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BLUE};margin-bottom:14px;">${escapeHtml(label)}</div>`;
}

function greeting(name: string): string {
  return `<p style="font-size:17px;font-weight:600;color:${INK};margin:0 0 18px 0;">Dear ${escapeHtml(name)},</p>`;
}

function p(text: string): string {
  return `<p style="font-size:15px;color:#283044;margin:0 0 16px 0;">${text}</p>`;
}

function note(text: string): string {
  return `<p style="font-size:13px;color:${INK_WEAK};margin:18px 0 0 0;">${text}</p>`;
}

/** Bulletproof-ish centered pill CTA button. */
function ctaButton(link: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px 0;">
    <tr><td align="center" bgcolor="${NAVY}" style="border-radius:999px;">
      <a href="${link}" target="_blank" style="display:inline-block;padding:15px 34px;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;border-radius:999px;background-color:${NAVY};">${escapeHtml(label)}&nbsp;&rarr;</a>
    </td></tr>
  </table>`;
}

/** Small "or paste this link" fallback row. */
function linkFallback(link: string): string {
  return `<p style="font-size:12px;color:${INK_WEAK};margin:14px 0 0 0;">Button not working? Click the link below or paste it into your browser:<br/>
    <a href="${link}" target="_blank" style="color:${BLUE};word-break:break-all;">${link}</a></p>`;
}

// ── 360 system emails ────────────────────────────────────────────────────────

/** Initial survey invitation (respondent or self-assessment). */
export function invitation360Html(
  participantName: string,
  respondentName: string,
  link: string,
  isSelf: boolean,
): string {
  const body = isSelf
    ? eyebrow("360 Leadership Feedback") +
      greeting(respondentName) +
      p("As part of your 360 Leadership Feedback process, we invite you to complete your <strong>self-assessment</strong>.") +
      p("Your honest self-reflection is an important part of this process. It is compared with feedback from your colleagues to give you a fuller picture of your leadership.") +
      p("The questionnaire includes 12 rating questions and 4 short written responses, and takes about <strong>10 minutes</strong>.") +
      ctaButton(link, "Begin Self-Assessment") +
      note("This link is unique to you and should not be shared.") +
      linkFallback(link)
    : eyebrow("Confidential Feedback Request") +
      greeting(respondentName) +
      p(`You are receiving this request because <strong>${escapeHtml(participantName)}</strong> has asked for your input as part of a confidential leadership development process.`) +
      p("The questionnaire includes 12 rating questions and 4 short written responses, and takes about <strong>10 minutes</strong>.") +
      p("Your responses are confidential. Feedback is reviewed in aggregate and used solely to support their leadership development.") +
      ctaButton(link, "Begin Feedback") +
      note("This link is unique to you and should not be shared.") +
      linkFallback(link);

  const pre = isSelf ? "Complete your 360 self-assessment — about 10 minutes." : `${participantName} has requested your confidential feedback.`;
  return renderDoc(body, pre);
}

/** Reminder for an outstanding survey (respondent or self-assessment). */
export function reminder360Html(
  participantName: string,
  respondentName: string,
  link: string,
  isSelf: boolean,
): string {
  const body = isSelf
    ? eyebrow("Friendly Reminder") +
      greeting(respondentName) +
      p("A quick reminder that your <strong>self-assessment</strong>, part of your 360 Leadership Feedback process, is still outstanding.") +
      p("Your self-reflection is an important part of the process and takes about <strong>10 minutes</strong>.") +
      ctaButton(link, "Continue Self-Assessment") +
      note("Thank you for taking the time to reflect.") +
      linkFallback(link)
    : eyebrow("Friendly Reminder") +
      greeting(respondentName) +
      p(`A quick reminder that <strong>${escapeHtml(participantName)}</strong> is awaiting your feedback as part of their leadership development process.`) +
      p("The questionnaire takes about <strong>10 minutes</strong>. Your responses are confidential and reviewed in aggregate.") +
      ctaButton(link, "Continue Feedback") +
      note("Thank you for taking the time to contribute.") +
      linkFallback(link);

  const pre = isSelf ? "Your self-assessment is still outstanding." : `${participantName} is still awaiting your feedback.`;
  return renderDoc(body, pre);
}

/** Wrap an admin-editable {{placeholder}} template body (onboarding / nomination) in the brand shell. */
export function adminTemplate360Html(recipientName: string, renderedBody: string): string {
  return renderDoc(greeting(recipientName) + p(nl2br(renderedBody)));
}

export interface LinkEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Build an admin-editable {{placeholder}} email that contains a link placeholder.
 * Returns resolved subject, branded HTML (placeholder → CTA button + fallback), and
 * a plain-text body (placeholder → raw URL) for the audit log.
 */
export function buildLinkEmail(opts: {
  subjectTemplate: string;
  bodyTemplate: string;
  vars: Record<string, string>;
  linkKey: string;
  link: string;
  ctaLabel: string;
}): LinkEmail {
  const subject = renderTemplate(opts.subjectTemplate, opts.vars);
  const text = renderTemplate(opts.bodyTemplate, { ...opts.vars, [opts.linkKey]: opts.link });

  // Render the body, stripping the bare {{link}} line (it's replaced by the CTA button),
  // and turn the remaining paragraphs into branded <p> blocks.
  const bodyHtml = renderTemplate(opts.bodyTemplate, { ...opts.vars, [opts.linkKey]: " LINK " })
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter((para) => para.length > 0 && para !== " LINK ")
    .map((para) => p(escapeHtml(para).replace(/\n/g, "<br/>")))
    .join("");

  const name = opts.vars.name ?? "there";
  const inner =
    eyebrow("360 Leadership Insight") +
    greeting(name) +
    bodyHtml +
    ctaButton(opts.link, opts.ctaLabel) +
    linkFallback(opts.link);

  const pre = subject;
  return { subject, html: renderDoc(inner, pre), text };
}

// Default admin-editable templates (seeded if none exist in DB).
export const DEFAULT_ONBOARDING_TEMPLATE = {
  subject: "Your 360 Leadership Insight — confirming your participation",
  body: `Thank you for taking part in the 360 Leadership Insight process.

This is a confidential leadership development exercise. You'll be asked to confirm your participation and then nominate the colleagues whose feedback you'd value.

Please click the button below to begin.

{{link}}`,
};

export const DEFAULT_NOMINATION_TEMPLATE = {
  subject: "Nominate your 360 feedback respondents",
  body: `It's time to choose the colleagues you'd like to provide feedback as part of your 360 Leadership Insight.

Please nominate a balanced group — for example managers, peers, and direct reports — using the private link below.

{{link}}`,
};
