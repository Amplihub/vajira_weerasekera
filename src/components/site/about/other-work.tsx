"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface WorkCard {
  image: string;
  tag: string;
  title: string;
  body: string;
  href: string;
}

const cards: WorkCard[] = [
  {
    image: "/about/work/motivating-mavericks.png",
    tag: "Book",
    title: "Motivating Mavericks",
    body: "A leadership book on how to lead high-performers who don't fit the standard mould. Built around a framework of 3 habits and 5 strategies that help teams unlock unconventional talent.",
    href: "https://www.amazon.com/Motivating-Mavericks-Secret-Performing-Teams-ebook/dp/B074N38RY5",
  },
  {
    image: "/about/work/life-of-the-run.png",
    tag: "Book",
    title: "Life of the Run",
    body: "A reflection on what ultra-marathon running teaches about leadership, community, and showing up for one another. Part of the Run for Life project.",
    href: "https://therunforlifeproject.org/lifeoftherun",
  },
  {
    image: "/about/work/veritas-signature.png",
    tag: "Craft studio",
    title: "Veritas Signature",
    body: "A small craft studio that makes handcrafted writing instruments from rare timbers. A portion of every sale goes to the Let Kids Fly Foundation turning craftsmanship into opportunity for children who need it most.",
    href: "https://veritassignature.com/",
  },
  {
    image: "/about/work/let-kids-fly.png",
    tag: "Fund",
    title: "Let Kids Fly Foundation",
    body: "A charitable foundation Vajira co-founded with his wife Kali and their sons. Its mission is a world where every child has the scholarships, community, and education support to reach their potential.",
    href: "https://letkidsfly.org/",
  },
];

export function AboutOtherWork() {
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
    <section className="relative overflow-hidden bg-[#eef3fb]">
      {/* Cloud sky band at the top, fading into the section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[388px]">
        <Image src="/about/cloud.png" alt="" fill sizes="100vw" className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#eef3fb]" />
      </div>

      <div className="relative mx-auto flex max-w-[1664px] flex-col gap-14 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[140px]">
        {/* Heading */}
        <div className="flex max-w-2xl flex-col gap-6">
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-ink sm:text-5xl">
            The work does not stop at coaching.
          </h2>
          <p className="text-base leading-7 text-brand-ink/70">
            Books, a craft studio, a foundation for children. Different shapes, same belief. Most people carry more
            potential than they have been given room to use.
          </p>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {cards.map((c) => (
              <article
                key={c.title}
                className="flex min-w-0 shrink-0 basis-[88%] flex-col gap-6 rounded-3xl border border-brand-blue/10 bg-white p-3 sm:basis-[46%] xl:basis-[31%]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#f0f1f4]">
                  <Image src={c.image} alt={c.title} fill sizes="(max-width:640px) 88vw, 31vw" className="object-cover" />
                </div>
                <div className="flex flex-col gap-4 px-5 pb-5">
                  <span className="text-sm font-medium text-[#d27300]">{c.tag}</span>
                  <h3 className="font-heading text-2xl font-semibold text-brand-ink">{c.title}</h3>
                  <p className="text-base leading-6 text-brand-ink/70">{c.body}</p>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 font-semibold text-brand-navy transition-opacity hover:opacity-80"
                  >
                    Read More <ArrowRight className="size-4" strokeWidth={2} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <div className="flex items-center justify-center gap-6">
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
      </div>
    </section>
  );
}
