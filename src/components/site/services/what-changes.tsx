"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

interface Shift {
  icon: string;
  title: string;
  body: string;
}

const shifts: Shift[] = [
  {
    icon: "/services/icons/run.svg",
    title: "Grow Into The Bigger Role Faster",
    body: "For leaders who've just been promoted or handed broader responsibility - and need to grow into the next level fast.",
  },
  {
    icon: "/services/icons/think.svg",
    title: "Think Clearly When Everything's Moving At Once",
    body: "For leaders facing transformation, AI adoption, restructuring, or shifting expectations - and needing clearer thinking under pressure.",
  },
  {
    icon: "/services/icons/next.svg",
    title: "Know What To Do Next - And Feel Sure About It",
    body: "For leaders who are performing well but quietly questioning what comes next - stay, step sideways, or pursue something different.",
  },
  {
    icon: "/services/icons/conversation.svg",
    title: "Stop Dreading The Hard Conversation",
    body: "For leadership moments you can't avoid: performance issues, conflict, team dynamics, or executive alignment where the stakes are real.",
  },
];

export function ServicesWhatChanges() {
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
    <section className="overflow-x-clip bg-brand-bg">
      <div className="grid lg:grid-cols-2">
        {/* Left: content + carousel */}
        <div className="flex min-w-0 flex-col gap-12 px-6 py-20 sm:px-8 lg:py-[140px] lg:pl-[128px] lg:pr-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] sm:text-5xl">
              <span className="text-brand-ink">What changes</span>
              <br />
              <span className="text-brand-blue">when we work together</span>
            </h2>
            <p className="max-w-lg text-base leading-7 text-brand-ink/70">
              Coaching does not hand you a new strategy. It changes how you think, decide, and hold a room when the
              pressure is on. These are the shifts leaders notice.
            </p>
          </div>

          {/* Carousel with blurred peek of the next card */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex items-stretch gap-4 sm:gap-6">
                {shifts.map((s) => (
                  <article
                    key={s.title}
                    className="flex min-w-0 shrink-0 basis-[88%] flex-col gap-6 rounded-3xl border border-brand-blue/10 bg-white p-6 sm:basis-[58%] sm:p-7"
                  >
                    <span className="flex w-fit items-center rounded-full bg-[#d27300]/5 p-2">
                      <Image src={s.icon} alt="" width={28} height={28} className="size-7" />
                    </span>
                    <div className="flex flex-col gap-4">
                      <h3 className="font-heading text-xl font-semibold leading-tight text-brand-ink">{s.title}</h3>
                      <p className="text-sm leading-6 text-brand-ink/70">{s.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            {/* Right-edge fade + blur over the peeking card */}
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-brand-bg via-brand-bg/70 to-transparent backdrop-blur-[1px] [mask-image:linear-gradient(to_left,black,transparent)] sm:block" />
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              className="text-brand-ink transition-opacity disabled:opacity-30"
            >
              <ChevronLeft className="size-7" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              className="text-brand-ink transition-opacity disabled:opacity-30"
            >
              <ChevronRight className="size-7" strokeWidth={1.5} />
            </button>
          </div>

          <Link
            href={BOOK_CALL_HREF}
            className="inline-flex h-14 w-fit items-center justify-center gap-2 rounded-full bg-brand-navy px-8 text-sm font-semibold uppercase tracking-[0.25px] text-brand-bg transition-opacity hover:opacity-90"
          >
            Book your call <ArrowUpRight className="size-4" strokeWidth={2} />
          </Link>
        </div>

        {/* Right: audience photo, full bleed */}
        <div className="relative min-h-[300px] overflow-hidden sm:min-h-[400px] lg:min-h-full">
          <Image
            src="/services/audience.png"
            alt="Audience at a keynote"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
