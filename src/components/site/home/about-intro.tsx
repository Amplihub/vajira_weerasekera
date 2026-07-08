import { Check } from "lucide-react";

const highlights = [
  "Former Microsoft CTO - Asia Services.",
  "Former Red Hat VP - Asia Office of Technology.",
  "30+ years leading technology organisations across the US, Europe, and Asia Pacific.",
  "Executive coach for senior leaders worldwide.",
  "Keynote speaker on psychological safety, leadership, and change in the AI era.",
];

export function AboutIntro() {
  return (
    <section className="border-y border-brand-ink/10 bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-20 sm:px-8 lg:flex-row lg:items-center lg:gap-[88px] lg:px-[236px] lg:py-[200px]">
        {/* Left: heading + prose */}
        <div className="flex flex-1 flex-col gap-12 lg:border-r lg:border-brand-navy/20 lg:pr-[88px]">
          <h2 className="font-heading text-3xl font-semibold leading-tight tracking-[-0.5px] text-brand-ink sm:text-[48px]">
            An executive coach who led through the pressure{" "}
            <span className="text-brand-blue">before he coached it.</span>
          </h2>
          <div className="flex flex-col gap-6 font-heading text-lg leading-[30px] text-brand-ink sm:text-xl">
            <p>
              Vajira Weerasekera spent more than 30 years leading technology organisations at Microsoft and Red Hat,
              across the US, Europe, and Asia Pacific. Former Microsoft CTO - Asia Services. Former Red Hat VP - Asia
              Office of Technology. He built and led a 400+ specialist organisation — including building Red Hat&apos;s
              first AI team across Asia — steered teams through regional expansion, and carried the decisions that get
              heavier with seniority.
            </p>
            <p>
              He knows what sustained pressure does to a team, because he led through years of it. The lesson he took
              from those years is plain. Results come from the environment a leader builds, not the pressure they
              apply.
            </p>
            <p>
              Today he brings that experience to senior leaders carrying the same weight, under harder conditions. He
              helps them build clarity, trust, and the conditions where their teams think clearly, speak openly, and
              perform at their best.
            </p>
          </div>
        </div>

        {/* Right: highlight pills */}
        <ul className="flex w-full flex-col gap-1 lg:flex-1">
          {highlights.map((h) => (
            <li
              key={h}
              className="flex items-center gap-4 rounded-full border border-brand-navy/50 bg-brand-bg p-6"
            >
              <span className="flex shrink-0 items-center rounded-full bg-[#d27300]/5 p-1">
                <Check className="size-4 text-[#d27300]" strokeWidth={2.5} />
              </span>
              <p className="text-base leading-6 text-brand-ink">{h}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
