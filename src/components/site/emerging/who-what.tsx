"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const builtFor = [
  "High-potential managers being groomed for senior leadership",
  "Recently promoted leaders",
  "Team leads stepping out of the work",
  "Functional experts taking on broader roles",
  "Future successors for senior positions",
];

// NOTE: capabilities 4-6 were off-screen in the design export — placeholders, replace with real copy.
const capabilities = [
  { title: "A 90-day leadership plan", body: "A written plan tied to your real role, ready to run the moment the program ends." },
  { title: "Sharper judgment under pressure", body: "Practice the real calls with a coach who's already made them at scale." },
  { title: "A tighter team while you're still in the program", body: "Apply the trust and safety work to your team in real time, not in retrospect." },
  { title: "Influence without the title", body: "Move decisions and people through trust and clarity, not position or authority." },
  { title: "Energy that lifts the whole team", body: "Build the conditions where your team brings its best, week after week." },
  { title: "A clear read on your own leadership", body: "Know your strengths, blind spots, and growth edges through honest 360 feedback." },
];

export function EmergingWhoWhat() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-[#f1f5fb]">
      <div className="mx-auto grid max-w-[1664px] gap-6 px-6 pb-10 sm:px-8 lg:grid-cols-2 lg:px-[128px]">
        {/* Who it's built for */}
        <div className="flex flex-col gap-8 rounded-[32px] bg-white/40 p-8 sm:p-12">
          <h2 className="font-heading text-3xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-ink sm:text-4xl">
            Who this program is built for
          </h2>
          <ul className="flex flex-col gap-3">
            {builtFor.map((b) => (
              <li key={b} className="flex items-center gap-4 rounded-xl border border-brand-blue/10 bg-white px-5 py-4">
                <span className="flex shrink-0 items-center rounded-full bg-[#d27300]/5 p-1.5">
                  <Check className="size-4 text-[#d27300]" strokeWidth={2.5} />
                </span>
                <span className="text-sm text-brand-ink">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What you'll learn */}
        <div className="flex flex-col gap-8 overflow-hidden rounded-[32px] bg-white/40 p-8 sm:p-12">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-3xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-ink sm:text-4xl">
              What you&apos;ll learn
            </h2>
            <p className="text-base leading-7 text-brand-ink/70">
              Six concrete capabilities - built on your real situations, not case studies.
            </p>
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {capabilities.map((c, i) => (
                <article
                  key={c.title}
                  className="flex min-w-0 shrink-0 basis-[80%] flex-col gap-6 rounded-2xl border border-brand-blue/10 bg-white p-6 sm:basis-[48%]"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#d27300]/5 text-sm font-semibold text-[#d27300]">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-heading text-xl font-semibold leading-tight text-brand-ink">{c.title}</h3>
                    <p className="text-sm leading-6 text-brand-ink/70">{c.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button type="button" aria-label="Previous" onClick={() => emblaApi?.scrollPrev()} disabled={!canPrev} className="text-brand-ink transition-opacity disabled:opacity-30">
              <ChevronLeft className="size-7" strokeWidth={1.5} />
            </button>
            <button type="button" aria-label="Next" onClick={() => emblaApi?.scrollNext()} disabled={!canNext} className="text-brand-ink transition-opacity disabled:opacity-30">
              <ChevronRight className="size-7" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
