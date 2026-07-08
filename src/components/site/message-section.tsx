import { CtaButton } from "@/components/site/cta-button";

interface MessageSectionProps {
  title: string;
  body: string;
  cta?: { label: string; href: string };
  className?: string;
}

// Centered heading + body + optional CTA. Used for 404 and Thank-you pages.
export function MessageSection({ title, body, cta }: MessageSectionProps) {
  return (
    <section className="flex flex-col items-center gap-10 px-6 py-32 text-center sm:px-12 lg:px-[150px] lg:py-[140px]">
      <div className="flex max-w-xl flex-col items-center gap-8">
        <h1 className="font-heading text-4xl font-semibold leading-none tracking-[-1.5px] text-brand-ink sm:text-5xl lg:text-[60px]">
          {title}
        </h1>
        <p className="max-w-md text-base leading-6 text-brand-ink/70">{body}</p>
      </div>
      {cta && (
        <CtaButton href={cta.href} icon={false} className="h-12">
          {cta.label}
        </CtaButton>
      )}
    </section>
  );
}
