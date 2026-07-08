import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

const steps = [
  {
    step: "Step 01",
    title: "We start with where you are",
    body: "Fill in our short form. Tell us about your situation, in your own words. No pressure, no commitment.",
  },
  {
    step: "Step 02",
    title: "We agree what we're working on",
    body: "Together we pick the two or three things that matter most. These become the focus of the engagement, so the work stays on what actually moves the needle.",
  },
  {
    step: "Step 03",
    title: "We meet on a steady cadence",
    body: "Sessions run every two to three weeks. Each one builds on the last. Between sessions, you have direct access for the calls and moments that can't wait.",
  },
  {
    step: "Step 04",
    title: "We check progress and adjust",
    body: "At the midpoint and the end, we step back. What's shifted, what's still stuck, and what the next chapter needs. The work flexes as your situation does.",
  },
];

export function CoachingHowItWorks() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[120px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-ink sm:text-5xl">
            How the coaching actually works
          </h2>
          <p className="text-base leading-7 text-brand-ink/70">
            The shape of a typical engagement, from first session to last.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col gap-6 rounded-3xl bg-brand-navy p-8">
              <span className="w-fit rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80">
                {s.step}
              </span>
              <div className="flex flex-col gap-4">
                <h3 className="font-heading text-2xl font-semibold leading-tight text-white">{s.title}</h3>
                <p className="text-sm leading-6 text-white/60">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href={BOOK_CALL_HREF}
          className="mx-auto inline-flex h-14 items-center justify-center gap-2 rounded-full border border-brand-navy/30 px-8 text-sm font-semibold uppercase tracking-[0.25px] text-brand-navy transition-colors hover:bg-brand-navy/5"
        >
          Book your call <ArrowUpRight className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
