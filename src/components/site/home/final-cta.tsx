import Image from "next/image";
import { CtaButton } from "@/components/site/cta-button";
import { DecorRings } from "@/components/site/decor-rings";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#eef3fb]">
      <DecorRings height={724} color="#081640" rightOnly />

      <div className="relative mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-20 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-[128px] lg:py-[120px]">
        {/* Left: heading + subtext */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <h2 className="font-heading text-3xl font-semibold leading-[1.15] tracking-[-0.5px] sm:text-5xl">
              <span className="text-brand-blue">For Leaders Carrying More Pressure,</span>
              <br />
              <span className="text-brand-ink">With Less Room To Get It Wrong.</span>
            </h2>
            <p className="max-w-2xl text-base leading-7 text-brand-ink/80">
              Coaching and programs{" "}
              <span className="font-semibold text-brand-ink">built on 30+ years of leading under that pressure.</span>
            </p>
          </div>
        </div>

        {/* Right: CTA */}
        <CtaButton href={BOOK_CALL_HREF} className="shrink-0">
          Book a discovery call
        </CtaButton>
      </div>
    </section>
  );
}

