import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

const points = ["Built around your context", "Run on the Human Edge framework", "Designed in partnership with you"];

export function ProgramsCustom() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto grid max-w-[1664px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-[128px] lg:py-[120px]">
        <div className="flex flex-col gap-10">
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] sm:text-5xl">
            <span className="text-brand-ink">Need a </span>
            <span className="text-brand-blue">Custom program</span>
            <br />
            <span className="text-brand-ink">built for you</span>
          </h2>
          <Link
            href="/contact"
            className="inline-flex h-14 w-fit items-center justify-center gap-2 rounded-full bg-brand-navy px-8 text-sm font-semibold uppercase tracking-[0.25px] text-brand-bg transition-opacity hover:opacity-90"
          >
            Request for custom course <ArrowUpRight className="size-4" strokeWidth={2} />
          </Link>
        </div>

        <ul className="flex flex-col gap-4">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-4 rounded-full border border-brand-navy/15 bg-white px-6 py-4">
              <span className="flex shrink-0 items-center rounded-full bg-[#d27300]/5 p-1.5">
                <Check className="size-4 text-[#d27300]" strokeWidth={2.5} />
              </span>
              <span className="text-base text-brand-ink">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
