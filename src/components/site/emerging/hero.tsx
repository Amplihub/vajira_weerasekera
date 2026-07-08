import Image from "next/image";
import { CtaButton } from "@/components/site/cta-button";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

export function EmergingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#eef3fb] to-[#dce8fb]">
      {/* Faint arc, top-left */}
      <div className="pointer-events-none absolute -left-40 -top-48 size-[640px] rounded-full border border-brand-navy/[0.06]" />

      <div className="grid items-stretch lg:grid-cols-2">
        {/* Left: content */}
        <div className="relative z-10 flex flex-col justify-center gap-10 px-6 pb-16 pt-36 sm:px-8 lg:py-32 lg:pl-[128px] lg:pr-12">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center rounded-full border border-white/40 bg-white/60 px-4 py-2 text-sm font-semibold text-brand-navy backdrop-blur sm:text-base">
              12-Week Cohort Program
            </span>
            <div className="flex flex-col gap-5">
              <h1 className="font-heading text-4xl font-semibold leading-none tracking-[-1.5px] text-brand-blue sm:text-5xl lg:text-[60px]">
                The Emerging Leaders Program.
              </h1>
              <p className="font-heading text-2xl font-semibold leading-tight tracking-[-0.5px] text-brand-navy sm:text-[40px]">
                12 weeks to make the shift from operational manager to strategic leader.
              </p>
            </div>
            <p className="max-w-xl text-base leading-6 text-brand-ink/70">
              Twelve weeks from now, you&apos;ve moved out of the doing and into leading, with the judgment and presence
              the next role expects you to have.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <CtaButton href={BOOK_CALL_HREF}>Book your call</CtaButton>
            <CtaButton href="#modules" variant="outline">
              View program modules
            </CtaButton>
          </div>
        </div>

        {/* Right: full-bleed image, top padding leaves space below the header */}
        <div className="px-6 pb-0 sm:px-8 lg:p-0 lg:pt-32">
          <div className="relative h-[320px] w-full overflow-hidden rounded-tl-[40px] lg:h-[560px]">
            <Image
              src="/home/emerging-image.png"
              alt="Emerging Leaders Program"
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
