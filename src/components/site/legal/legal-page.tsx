export type LegalBlock = string | { bullets: string[] };
export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

interface LegalPageProps {
  title: string;
  meta: string[]; // e.g. ["Last updated: May 2026", "Effective date: May 2026"]
  intro: string[];
  sections: LegalSection[];
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        typeof b === "string" ? (
          <p key={i} className="text-sm leading-7 text-brand-ink/80">
            {b}
          </p>
        ) : (
          <ul key={i} className="flex list-disc flex-col gap-1.5 pl-6 text-sm leading-7 text-brand-ink/80">
            {b.bullets.map((li, j) => (
              <li key={j}>{li}</li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

// Shared layout for Terms & Privacy. Renders title, metadata, intro, and numbered sections.
export function LegalPage({ title, meta, intro, sections }: LegalPageProps) {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 pb-24 pt-36 sm:px-8 lg:pt-44">
        <header className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.5px] text-brand-ink sm:text-5xl">{title}</h1>
          <div className="flex flex-col gap-0.5 text-sm text-brand-ink/60">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </header>

        <div className="flex flex-col gap-3">
          <Blocks blocks={intro} />
        </div>

        <div className="flex flex-col gap-10">
          {sections.map((s) => (
            <div key={s.heading} className="flex flex-col gap-3">
              <h2 className="font-heading text-lg font-semibold text-brand-ink">{s.heading}</h2>
              <Blocks blocks={s.blocks} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
