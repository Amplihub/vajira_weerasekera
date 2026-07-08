interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalLayoutProps {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalLayout({ title, updated, intro, sections }: LegalLayoutProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-36 sm:px-8 lg:pt-44">
      <h1 className="font-heading text-4xl font-semibold leading-none tracking-[-1.5px] text-brand-ink sm:text-5xl lg:text-[60px]">
        {title}
      </h1>
      <p className="mt-4 text-sm text-brand-ink/50">Last updated: {updated}</p>
      <p className="mt-8 text-base leading-7 text-brand-ink/70">{intro}</p>

      <div className="mt-12 flex flex-col gap-10">
        {sections.map((s) => (
          <div key={s.heading} className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.15px] text-brand-navy">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="text-base leading-7 text-brand-ink/70">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
