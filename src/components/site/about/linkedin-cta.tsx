import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LINKEDIN_URL } from "@/lib/site-nav";

export function AboutLinkedinCta() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto max-w-[1664px] px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[80px]">
        <div className="relative grid overflow-hidden rounded-[32px] bg-[#eef3fb] lg:grid-cols-2">
          {/* Faint ring */}
          <div className="pointer-events-none absolute -right-24 -top-48 size-[520px] rounded-full border border-brand-navy/10" />

          {/* Left: copy */}
          <div className="relative z-10 flex flex-col gap-8 p-8 sm:p-12 lg:py-20 lg:pl-16">
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-3xl font-semibold leading-[1.15] tracking-[-0.5px] sm:text-[40px]">
                <span className="text-brand-ink">The thinking behind the coaching.</span>
                <br />
                <span className="text-brand-blue">He posts it on LinkedIn.</span>
              </h2>
              <p className="max-w-lg text-base leading-7 text-brand-ink/70">
                Short posts on leadership, psychological safety, and performance under pressure. The same thinking that
                shapes his coaching, written the way he talks.
              </p>
            </div>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-fit items-center justify-center gap-2 rounded-full bg-brand-navy px-8 text-sm font-semibold uppercase tracking-[0.25px] text-brand-bg transition-opacity hover:opacity-90"
            >
              Read his LinkedIn posts <ArrowUpRight className="size-4" strokeWidth={2} />
            </a>
          </div>

          {/* Right: portrait */}
          <div className="relative hidden min-h-[420px] lg:block">
            <Image
              src="/about/linkedin-portrait.png"
              alt="Vajira Weerasekara"
              fill
              sizes="50vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
