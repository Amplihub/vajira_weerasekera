import Script from "next/script";

interface GhlEmbedProps {
  /** GoHighLevel booking/calendar (or form) embed URL. */
  src?: string;
  title: string;
  /** Initial/min height (px) before the GHL script auto-sizes to content. */
  height?: number;
  /** What this embed is ("booking calendar", "contact form", …) for the placeholder. */
  label?: string;
  /** The env var that supplies the URL — shown in the placeholder until set. */
  envName?: string;
}

// GoHighLevel iframe embed (forms / booking). Loads GHL's form_embed.js, which
// listens for the iframe's postMessage height and resizes it to the full content
// height — so the form shows in full with no inner scrollbar. Until the URL is
// configured a styled placeholder renders.
export function GhlEmbed({ src, title, height = 720, label = "Booking calendar", envName = "NEXT_PUBLIC_GHL_BOOKING_URL" }: GhlEmbedProps) {
  if (!src) {
    return (
      <div
        className="flex w-full items-center justify-center rounded-2xl border border-dashed border-brand-navy/30 bg-brand-blue/5 text-center text-sm text-brand-ink/60"
        style={{ minHeight: height }}
      >
        <p className="max-w-sm px-6">
          {label} embed — connect the GoHighLevel URL via{" "}
          <code className="rounded bg-white px-1">{envName}</code>.
        </p>
      </div>
    );
  }

  const formId = src.split("/").filter(Boolean).pop() ?? "";
  const iframeId = `inline-${formId}`;
  // Derive the script host from the embed URL (white-labelled GHL domain).
  const scriptSrc = `${new URL(src).origin}/js/form_embed.js`;

  return (
    <>
      <iframe
        src={src}
        title={title}
        id={iframeId}
        loading="lazy"
        scrolling="no"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-form-id={formId}
        data-layout-iframe-id={iframeId}
        data-height={height}
        className="w-full rounded-2xl border border-brand-navy/10"
        style={{ width: "100%", minHeight: height, border: "none" }}
      />
      <Script src={scriptSrc} strategy="afterInteractive" />
    </>
  );
}
