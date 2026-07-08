import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ServicesSummary() {
  return (
    <section className="border-y border-brand-ink/10 bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-6 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[100px]">
        <h2 className="max-w-3xl font-heading text-3xl font-semibold leading-tight tracking-[-0.5px] text-brand-ink sm:text-5xl">
          Coaching, keynotes, and programs{" "}
          <span className="text-brand-blue">built around the same thinking.</span>
        </h2>
        <p className="max-w-2xl text-base leading-7 text-brand-ink/70">
          Every format draws on the same framework: clarity, energy, trust, and results.
          Whether it is a one-on-one engagement or a full leadership program, the work
          starts from the same place.
        </p>
        <Link
          href="/speaking"
          className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand-navy underline decoration-brand-blue/30 underline-offset-4 transition-colors hover:text-brand-blue"
        >
          See speaking topics
          <ArrowUpRight className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
