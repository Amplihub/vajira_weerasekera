import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CoachingMoments } from "@/components/site/coaching/moments";
import { CoachingEngage } from "@/components/site/coaching/engage";
import { CoachingHowItWorks } from "@/components/site/coaching/how-it-works";
import { CoachingExperience } from "@/components/site/coaching/experience";
import { CoachingFaq } from "@/components/site/coaching/faq";
import { PremiumCalendar } from "@/components/site/contact/premium-calendar";
import { FinalCta } from "@/components/site/home/final-cta";

export const metadata: Metadata = {
  title: "Executive Coaching — Vajira Weerasekera",
  description:
    "One-to-one executive coaching for senior leaders. Real pushback from someone who has led global teams at Microsoft and Red Hat.",
};

export default function ExecutiveCoachingPage() {
  return (
    <>
      <div className="relative overflow-hidden w-full max-w-full">
        <div className="absolute inset-0 -z-10 bg-slate-50">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] animate-[pulse_9s_ease-in-out_infinite]" />
          <div className="absolute top-24 right-[-15%] w-[760px] h-[760px] bg-indigo-200/40 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
        </div>
        <PageHero
          skySrc={null}
          eyebrow="EXECUTIVE ADVISORY & COACHING"
          eyebrowClassName="text-xs font-semibold tracking-widest uppercase text-slate-500"
          title={
            <>
              Get <span className="font-serif italic font-normal text-blue-600">coached</span> by someone who&apos;s actually sat in your chair.
            </>
          }
          titleClassName="text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.05]"
          subtext="Microsoft CTO, Red Hat VP, 14 countries — and gives you real pushback instead of polite reflection."
          ctas={[
            { label: "Apply for coaching", href: "#apply" },
            {
              label: "View coaching sessions",
              href: "#sessions",
              variant: "outline",
            },
          ]}
          image={{
            src: "/home/coaching-portrait.png",
            alt: "Vajira Weerasekara",
            sizes: "690px",
          }}
          imageClassName="[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
          containerClassName="lg:grid-cols-[1fr_minmax(0,690px)] relative z-10"
        />
      </div>
      <CoachingMoments />
      <div id="sessions" className="scroll-mt-28" />
      <CoachingEngage />
      <CoachingHowItWorks />
      <CoachingExperience />
      <CoachingFaq />
      <section id="apply" className="bg-slate-50 py-20 md:py-32">
        <div className="mx-auto flex max-w-[1664px] flex-col items-center text-center gap-16 px-6 sm:px-8 lg:px-[128px]">
          <div className="flex flex-col items-center gap-6 max-w-2xl">
            <h2 className="font-sans text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl text-slate-900">
              Apply to work with <span className="font-serif italic font-normal text-blue-600">Vajira</span>.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              A few questions about where you are and what you want to shift. If it&apos;s a fit, we&apos;ll set up a call.
            </p>
          </div>
          <div className="w-full max-w-lg mx-auto">
            <PremiumCalendar />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
