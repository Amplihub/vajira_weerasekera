import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PremiumCalendar } from "@/components/site/contact/premium-calendar";

export const metadata: Metadata = {
  title: "Keynote Speaking — Vajira Weerasekera",
  description:
    "Keynotes on leadership in the AI era from a speaker who has led global teams at Microsoft and Red Hat across 14 countries.",
};

const keynotes = [
  {
    image: "/speaking/keynotes/human-edge.png",
    tag: "LEADERSHIP & AI",
    title: "The Human Edge of Leadership in the Age of AI",
    body: "This keynote shows your audience exactly what doesn't get automated, and how to lead teams made up of both people and AI agents without losing the things that actually drive performance.",
  },
  {
    image: "/speaking/keynotes/mavericks.png",
    tag: "TALENT & CULTURE",
    title: "Motivating Mavericks: Leading Unconventional Talent",
    body: "The best ideas often come from people who don't fit the standard mould. Based on Vajira's book Motivating Mavericks, this keynote shows your audience how to attract these people, keep them, and channel their creative tension into real competitive advantage.",
  },
  {
    image: "/speaking/keynotes/energy.png",
    tag: "PERFORMANCE",
    title: "Energy, Not Just Engagement: The Leadership Multiplier",
    body: "Engagement scores keep climbing. Output doesn't always follow. This keynote unpacks why traditional engagement models miss the point, and shows your audience how to build the kind of organisational energy that turns good teams into exceptional ones.",
  },
  {
    image: "/speaking/keynotes/clarity.png",
    tag: "DECISION MAKING",
    title: "From Complexity to Clarity: Decision-Making Under Pressure",
    body: "Senior leaders rarely get to decide with full data, full alignment, or full time. This keynote gives your audience a practical framework for making sharper calls when all three are missing - and a way to carry the room with them once the call is made.",
  },
];

const stages = [
  {
    image: "/speaking/stages/red-hat.png",
    tag: "KEYNOTE PRESENTATION",
    title: "Asia Red Hat Summit – Keynote on AI & Portfolio",
  },
  {
    image: "/speaking/stages/asian-leadership.png",
    tag: "LEADERSHIP CONFERENCES",
    title: "Asian Leadership Project – Keynote on The Human Edge",
  },
  {
    image: "/speaking/stages/ey-partner.png",
    tag: "EXECUTIVE FORUMS",
    title: "EY Partner Event – Leadership Panel Discussion",
  },
];

export default function SpeakingPage() {
  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white min-h-[calc(100vh-7rem)] flex flex-col justify-center pt-24 pb-12">
        {/* Ambient mesh background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 mb-6 md:mb-10">
          <div className="flex flex-col items-start justify-center text-left">
            <span className="mb-6 block text-xs font-semibold tracking-widest uppercase text-slate-500">
              KEYNOTES & SPEAKING
            </span>
            <h1 className="text-6xl md:text-[5.5rem] leading-[1.05] tracking-tight text-slate-900 font-bold">
              Book a <span className="font-serif italic font-normal text-blue-600">keynote</span> your senior audience will actually use back at work.
            </h1>
          </div>
          <div className="relative mx-auto mt-12 lg:mt-0 w-[95%] max-w-[450px] aspect-square">
            {/* Decorative rings — scale proportionally with the wrapper */}
            <div className="absolute -inset-6 -z-10 rounded-full border border-blue-500/15 animate-ring-pulse" aria-hidden="true" />
            <div className="absolute -inset-14 -z-10 rounded-full border border-blue-500/10 animate-ring-pulse [animation-delay:1.5s]" aria-hidden="true" />
            
            {/* Circular Image Container */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl bg-transparent">
              <Image 
                src="/home/speaking-portrait.png" 
                alt="Vajira speaking" 
                fill
                priority
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Video (Sizzle Reel) */}
      <section className="py-20 md:py-32 relative bg-white z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
          <h2 className="mb-16 text-center text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl max-w-3xl">
            From recent <span className="font-serif italic font-normal text-blue-600">keynotes</span>, leadership interviews, and forum panels.
          </h2>
          <div className="aspect-video w-full max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-2xl shadow-slate-200/50 bg-slate-100">
            <video
              controls
              preload="metadata"
              poster="/videos/speaker-reel-poster.jpg"
              className="w-full h-full object-cover"
            >
              <source src="/videos/speaker-reel.mp4" type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        </div>
      </section>

      {/* 3. Keynotes Built Around (Topics Grid) */}
      <section className="py-20 md:py-32 bg-slate-50 relative z-10 border-y border-slate-200/50">
        <div className="mx-auto max-w-[1664px] px-6 lg:px-[128px]">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-16 max-w-2xl">
            Topics built around the <span className="font-serif italic font-normal text-blue-600">calls</span> your audience is making right now.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {keynotes.map((k) => (
              <article key={k.title} className="group flex flex-col">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
                  <Image 
                    src={k.image} 
                    alt={k.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <div className="mt-8 flex flex-col items-start">
                  <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
                    {k.tag}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-6 mb-4">
                    {k.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {k.body}
                  </p>
                  <Link
                    href="#booking"
                    className="inline-flex items-center text-sm font-bold text-blue-600 mt-6 group-hover:translate-x-2 transition-transform duration-300"
                  >
                    Discuss this topic <ArrowRight className="ml-2 size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Recent Stages */}
      <section className="py-20 md:py-32 bg-white relative z-10">
        <div className="mx-auto max-w-[1664px] px-6 lg:px-[128px]">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-16">
            Recent <span className="font-serif italic font-normal text-blue-600">stages.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stages.map((s) => (
              <article key={s.title} className="group flex flex-col">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
                  <Image 
                    src={s.image} 
                    alt={s.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <div className="mt-6 flex flex-col items-start">
                  <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
                    {s.tag}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-6 mb-4">
                    {s.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Booking Section */}
      <section id="booking" className="py-20 md:py-32 bg-slate-50 border-t border-slate-200/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: Copy */}
            <div className="flex flex-col max-w-xl">
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-6 block">
                SPEAKING ENQUIRY
              </span>
              <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-8">
                Bring Vajira to your <span className="font-serif italic font-normal text-blue-600">stage.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-10">
                Share your event details, audience profile, and date — we'll come back to you promptly with availability and fit. Select a time on the calendar to discuss your event directly.
              </p>
            </div>

            {/* Right: Premium Calendar */}
            <div className="w-full">
              <PremiumCalendar />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
