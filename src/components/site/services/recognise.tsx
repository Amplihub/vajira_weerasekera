"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

const personas = [
  { icon: "/services/icons/first-time.svg", label: "The First-Time Leader" },
  { icon: "/services/icons/expert.svg", label: "The High-Performing Expert" },
  { icon: "/services/icons/senior.svg", label: "The Senior Leader Under Pressure" },
];

const builds = [
  {
    title: "Build managers your high-performers actually respect",
    body: "Walk away with managers who can lead people - not just out-perform them.",
  },
  {
    title: "Build leaders who hold steady when everything changes",
    body: "AI, restructuring - your leaders stop reacting and start leading the room. Calm at the top travels fast.",
  },
  {
    title: "A leadership bench you can actually promote from",
    body: "Walk away with a layer of leaders ready for the next responsibility - before you need them.",
  },
  {
    title: "Build one standard of leadership across the whole company",
    body: "Walk away with consistent trust, accountability, and standards across every team you lead.",
  },
  {
    title: "Build teams that pull tighter under pressure",
    body: "Trust goes up. Energy goes up. Output follows. Walk away with managers creating the environments where good people do their best work.",
  },
  {
    title: "Build the next generation of leaders shaping your future",
    body: "Your high-potentials are the future of the company. Walk away knowing the people who will lead it next are ready.",
  },
];

export function ServicesRecognise() {
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
    <section className="bg-brand-navy">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[140px]">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left card: personas */}
          <div className="flex flex-col gap-8 rounded-[32px] bg-white/[0.04] p-8 sm:p-12">
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-3xl font-semibold leading-[1.15] tracking-[-0.5px] text-white sm:text-4xl">
                You will recognise yourself in one of these.
              </h2>
              <p className="text-base leading-7 text-white/60">
                The leaders Vajira works with come from very different roles. What they share is that they care about
                how they lead, and they want to walk away with something real.
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {personas.map((p) => (
                <li key={p.label} className="flex items-center gap-4 rounded-2xl bg-white/[0.06] p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                    <Image src={p.icon} alt="" width={22} height={22} className="size-[22px]" />
                  </span>
                  <span className="font-heading text-lg font-medium text-white">{p.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right card: builds carousel */}
          <div className="flex flex-col gap-8 overflow-hidden rounded-[32px] bg-white/[0.04] p-8 sm:p-12">
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-3xl font-semibold leading-[1.15] tracking-[-0.5px] sm:text-4xl">
                <span className="text-white/50">What you will build</span> <span className="text-white">by working with him.</span>
              </h2>
              <p className="text-base leading-7 text-white/60">
                You bring Vajira in to strengthen leadership where it actually shows up in your business, not in
                theory. Here is what gets built
              </p>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-5">
                {builds.map((b, i) => (
                  <article
                    key={b.title}
                    className="flex min-w-0 shrink-0 basis-[80%] flex-col gap-6 rounded-2xl bg-white/[0.06] p-6 sm:basis-[55%]"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#d27300]">
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-4">
                      <h3 className="font-heading text-xl font-semibold leading-tight text-white">{b.title}</h3>
                      <p className="text-sm leading-6 text-white/70">{b.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                className="text-white transition-opacity disabled:opacity-30"
              >
                <ChevronLeft className="size-7" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                className="text-white transition-opacity disabled:opacity-30"
              >
                <ChevronRight className="size-7" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={BOOK_CALL_HREF}
          className="mx-auto inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/40 px-8 text-sm font-semibold uppercase tracking-[0.25px] text-white transition-colors hover:bg-white/10"
        >
          Book your call <ArrowUpRight className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
