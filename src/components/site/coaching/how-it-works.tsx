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
    <section className="bg-transparent py-20 md:py-32">
      <div className="mx-auto flex max-w-[1664px] flex-col px-6 sm:px-8 lg:px-[128px]">
        <div className="flex flex-col gap-6 text-left max-w-2xl mb-16">
          <h2 className="font-sans text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            How the coaching actually works
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            The shape of a typical engagement, from first session to last.
          </p>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {steps.map((s, index) => {
            const num = String(index + 1).padStart(2, "0");
            return (
              <div key={s.step} className="flex flex-col gap-6 border-t border-slate-200 pt-6">
                <span className="text-xs font-semibold tracking-widest text-blue-600">
                  {num}
                </span>
                <div className="flex flex-col gap-4">
                  <h3 className="font-sans text-xl font-bold leading-tight text-slate-900">{s.title}</h3>
                  <p className="text-[15px] leading-relaxed text-slate-600 font-light">{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href={BOOK_CALL_HREF}
          className="bg-slate-900 text-white rounded-full px-8 py-4 text-sm font-bold tracking-[0.1em] uppercase hover:bg-blue-600 transition-all duration-300 w-fit mt-8"
        >
          Book your call
        </Link>
      </div>
    </section>
  );
}
