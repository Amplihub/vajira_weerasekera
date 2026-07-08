"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { SquarePen, Clock, Speech, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { GhlEmbed } from "@/components/site/ghl-embed";
import { testimonials } from "@/lib/testimonials";

const steps = [
  { icon: SquarePen, label: "You book a time" },
  { icon: Clock, label: "We talk for 30 minutes" },
  { icon: Speech, label: "You decide what's next" },
];

export function ContactBooking() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });

  // Auto-advance loop
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000); // 6 seconds per testimonial to match a smooth reading pace
    return () => clearInterval(interval);
  }, [emblaApi]);
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-12 sm:px-8 lg:px-[128px] lg:py-[80px]">
        {/* Steps */}
        <div className="flex flex-col gap-6">
          <h2 className="font-heading text-3xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-ink sm:text-4xl">
            Three steps. No surprises.
          </h2>
          <ul className="flex flex-wrap gap-3">
            {steps.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-brand-ink/10 px-4 py-2 text-sm font-medium text-brand-ink/80"
              >
                <Icon className="size-4 text-brand-blue" strokeWidth={2} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,720px)] lg:items-start lg:gap-20">
          {/* Left: credibility + static testimonial */}
          <div className="flex flex-col gap-10 lg:sticky lg:top-32">
            <div className="flex flex-col gap-8">
              <h3 className="font-heading text-2xl leading-snug tracking-[-0.25px] text-brand-ink sm:text-3xl">
                <span className="font-normal">30+ years leading across </span>
                <span className="font-semibold text-brand-blue">
                  Microsoft, Red Hat, and global tech. Harvard-trained.
                </span>
              </h3>

              {/* Logos */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 opacity-80 mix-blend-multiply grayscale">
                <Image
                  src="/home/logos/microsoft.svg"
                  alt="Microsoft"
                  width={228}
                  height={63}
                  className="h-6 w-auto max-w-[34%] object-contain"
                />
                <Image
                  src="/home/logos/harvard.png"
                  alt="Harvard Business School"
                  width={120}
                  height={44}
                  className="h-10 w-auto max-w-[34%] object-contain"
                />
                <Image
                  src="/home/logos/redhat.svg"
                  alt="Red Hat"
                  width={205}
                  height={49}
                  className="h-7 w-auto max-w-[34%] object-contain"
                />
              </div>
            </div>

            {/* Auto-looping Single Testimonial Carousel */}
            <div className="flex flex-col gap-6 border-t border-brand-ink/10 pt-10">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                  {testimonials.map((t) => (
                    <div key={t.name} className="min-w-0 shrink-0 basis-full">
                      <div className="flex flex-col gap-6 select-none cursor-grab active:cursor-grabbing">
                        <p className="font-serif text-[1.35rem] italic leading-[1.4] text-brand-ink/80">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="size-12 shrink-0 overflow-hidden rounded-full bg-brand-ink/5">
                            <Image src={t.image} alt={t.name} width={48} height={48} className="size-full object-cover grayscale" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-brand-ink">{t.name}</span>
                            <span className="text-sm text-brand-ink/60 line-clamp-1" title={t.role}>{t.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Optional: Add manual arrow overrides if requested, but maintaining the minimal look is better without them. 
                  User said "with normal manual swipe/arrow override" — swipe is handled above, let's add minimal arrows. */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => emblaApi?.scrollPrev()}
                  className="text-brand-ink/40 transition-colors hover:text-brand-ink"
                >
                  <ArrowLeft className="size-5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => emblaApi?.scrollNext()}
                  className="text-brand-ink/40 transition-colors hover:text-brand-ink"
                >
                  <ArrowRight className="size-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Calendar embed & fallback links */}
          <div className="flex flex-col gap-6" id="book">
            <div className="overflow-hidden rounded-3xl border border-brand-ink/5 bg-white shadow-soft">
              {/* Note: NEXT_PUBLIC_GHL_BOOKING_URL is serving as the calendar embed here */}
              <GhlEmbed
                src={process.env.NEXT_PUBLIC_GHL_BOOKING_URL}
                title="Book a free 1:1 call with Vajira"
                height={700}
              />
            </div>
            
            {/* Understated fallback options */}
            <div className="flex flex-col gap-3 px-2 text-sm text-brand-ink/60 sm:flex-row sm:items-center sm:gap-6">
              <Link href="/speaking#enquiry" className="inline-flex items-center gap-1 transition-colors hover:text-brand-blue">
                Looking to book a keynote? Submit a speaking enquiry <ArrowUpRight className="size-3.5" />
              </Link>
              <span className="hidden sm:block text-brand-ink/20">|</span>
              <a href="mailto:hello@vajiraweerasekera.com" className="inline-flex items-center gap-1 transition-colors hover:text-brand-blue">
                Not ready to book? Send an email <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
