import type { Metadata } from "next";
import { AboutLeadership } from "@/components/site/about/leadership";
import { AboutLinkedinCta } from "@/components/site/about/linkedin-cta";
import { FinalCta } from "@/components/site/home/final-cta";
import { BOOK_CALL_HREF } from "@/lib/site-nav";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About — Vajira Weerasekera",
  description:
    "30+ years leading global teams across the US, Europe, and Asia Pacific — now coaching senior leaders to build results through clarity, not pressure.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-50 pt-32 pb-16 lg:pt-48">
        {/* The Unified Ambient Canvas (Animated Background) */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-40 right-[-10%] w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center px-4 sm:px-6 lg:px-8">
          
          {/* Left Column: Typography & CTAs */}
          <div className="relative z-20 flex flex-col items-start justify-center text-left lg:pr-8">
            {/* Eyebrow */}
            <span className="mb-6 block opacity-0 animate-fade-in-up text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 [animation-delay:100ms]">
              EXECUTIVE COACH & ADVISOR
            </span>
            
            {/* Headline */}
            <h1 className="opacity-0 animate-fade-in-up text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.05] [animation-delay:200ms]">
              A coach who spent 30 years in the chair his clients sit in{" "}
              <span className="font-serif italic font-normal text-blue-600">now.</span>
            </h1>
            
            {/* Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-8 opacity-0 animate-fade-in-up [animation-delay:400ms]">
              <Link 
                href={BOOK_CALL_HREF}
                className="bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:scale-105 hover:bg-blue-600 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-300"
              >
                BOOK YOUR CALL
              </Link>
            </div>
          </div>
          
          {/* Right Column: Portrait */}
          <div className="relative z-10 w-full max-w-[400px] lg:max-w-[550px] aspect-square mx-auto md:ml-auto opacity-0 animate-fade-in-scale [animation-delay:200ms] lg:mx-0 lg:mt-10">
            {/* Subtle background gradient behind the image area */}
            <div className="absolute inset-0 -z-20 rounded-full bg-gradient-to-tr from-blue-100/40 to-transparent blur-3xl" aria-hidden="true" />
            
            {/* Decorative rings, matching the homepage hero motif */}
            <div className="absolute -inset-6 -z-10 rounded-full border border-blue-500/15" aria-hidden="true" />
            <div className="absolute -inset-14 -z-10 hidden rounded-full border border-blue-500/10 sm:block" aria-hidden="true" />

            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl bg-transparent">
              <Image
                src="/home/about-portrait.png"
                alt="Vajira Weerasekara"
                width={800}
                height={800}
                priority
                className="w-full h-full object-cover object-[center_top]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <AboutLeadership />
      <AboutLinkedinCta />
      <FinalCta />
    </>
  );
}
