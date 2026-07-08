import { WorkCardsGrid } from "@/components/site/work-cards";

export function ServicesWorkWithHim() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[140px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] sm:text-5xl">
            <span className="text-brand-ink">Wherever you are</span>
            <br />
            <span className="text-brand-blue">
              There is a way to work with him.
            </span>
          </h2>
          <p className="max-w-xl text-base leading-7 text-brand-ink/70">
            One-on-one coaching, keynotes, an emerging leaders program, or a
            program for your whole team. Start wherever the pressure is.
          </p>
        </div>

        <WorkCardsGrid frameClassName="bg-primary" />
      </div>
    </section>
  );
}
