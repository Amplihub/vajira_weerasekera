import { GhlEmbed } from "@/components/site/ghl-embed";

// Branded marketing section wrapping a GHL form embed (speaking enquiry,
// coaching application, contact form). Anchored so hero CTAs can deep-link.
export function FormEmbedSection({
  id,
  eyebrow,
  title,
  subtext,
  src,
  label,
  envName,
  height = 760,
}: {
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtext?: string;
  src?: string;
  label: string;
  envName: string;
  height?: number;
}) {
  return (
    <section id={id} className="scroll-mt-28 bg-brand-bg">
      <div className="mx-auto max-w-[900px] px-6 py-20 sm:px-8 lg:py-[120px]">
        <div className="mb-8 flex flex-col gap-3 text-center">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">{eyebrow}</p>}
          <h2 className="font-heading text-3xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-ink sm:text-4xl">{title}</h2>
          {subtext && <p className="mx-auto max-w-xl text-sm leading-7 text-brand-ink/60">{subtext}</p>}
        </div>
        <GhlEmbed src={src} title={label} label={label} envName={envName} height={height} />
      </div>
    </section>
  );
}
