import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Emerging Leaders Program — Vajira Weerasekera",
  description: "A 12-week cohort program to make the shift from operational manager to strategic leader.",
};

const builtFor = [
  "High-potential managers being groomed for senior leadership",
  "Recently promoted leaders",
  "Team leads stepping out of the work",
  "Functional experts taking on broader roles",
  "Future successors for senior positions",
];

const capabilities = [
  { title: "A 90-day leadership plan", body: "A written plan tied to your real role, ready to run the moment the program ends." },
  { title: "Sharper judgment under pressure", body: "Practice the real calls with a coach who's already made them at scale." },
  { title: "A tighter team while you're still in the program", body: "Apply the trust and safety work to your team in real time, not in retrospect." },
  { title: "Influence without the title", body: "Move decisions and people through trust and clarity, not position or authority." },
  { title: "Energy that lifts the whole team", body: "Build the conditions where your team brings its best, week after week." },
  { title: "A clear read on your own leadership", body: "Know your strengths, blind spots, and growth edges through honest 360 feedback." },
];

const modules = [
  {
    title: "Module 1: The Leadership Mindset Shift",
    body: "Understanding the fundamental difference between managing and leading. Assessing your current leadership style and identifying growth edges. Building self-awareness through 360-degree feedback and personal reflection. Setting your leadership development intentions for the program.",
  },
  {
    title: "Module 2: Leading with Clarity",
    body: "Cutting through organisational noise to set direction. Communicating with precision so your team knows what matters and why. Making and owning decisions when the data is incomplete.",
  },
  {
    title: "Module 3: Building Psychological Safety and Energizing Teams",
    body: "Creating the conditions where people speak openly and take smart risks. Reading and lifting the energy of a team, and spotting the drains before they cost you.",
  },
  {
    title: "Module 4: Influence Without Authority",
    body: "Moving decisions and people through trust, credibility, and clarity rather than position. Navigating stakeholders and organisational politics without losing integrity.",
  },
  {
    title: "Module 5: Resilience and Sustainable Performance",
    body: "Leading under sustained pressure without burning yourself or your team out. Building habits and boundaries that keep performance high over the long run.",
  },
  {
    title: "Integration: Leading at the Human-AI Edge",
    body: "Bringing the framework together to lead teams made up of both people and AI. Knowing what only human judgment can do, and building it deliberately.",
  },
  {
    title: "Certification: Certificate of Completion & Applied Leadership Practice",
    body: "A certificate awarded on demonstrated application in real leadership contexts, plus a practical 90-day leadership plan you leave the program with.",
  },
];

export default function EmergingLeadersPage() {
  return (
    <>
      {/* 1. Hero Section Upgrade */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column (Text) */}
          <div className="flex flex-col gap-8 w-full max-w-xl z-10">
            <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
              12-Week Cohort Program
            </span>
            <h1 className="text-5xl lg:text-[4rem] font-bold text-slate-900 tracking-tight leading-[1.05]">
              The Emerging Leaders <span className="font-serif italic font-normal text-blue-600">Program.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Twelve weeks from now, you&apos;ve moved out of the doing and into leading, with the judgment and presence the next role expects you to have.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <Link href="/contact" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-3.5 font-semibold transition-all inline-flex items-center justify-center">
                Book your call
              </Link>
              <a href="#learn" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-full px-8 py-3.5 font-semibold transition-all inline-flex items-center justify-center">
                View program modules
              </a>
            </div>
          </div>

          {/* Right Column: Hero Image with Fluid Circular Mask */}
          <div className="relative flex justify-center lg:justify-end items-center mt-12 lg:mt-0 w-full">
            {/* Image and Rings Wrapper */}
            <div className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-square">
              {/* Concentric Decorative Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full border border-slate-200/50" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] aspect-square rounded-full border border-slate-200" />
              
              {/* Fluid Circle Container */}
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/home/emerging-image.png"
                  alt="Emerging Leaders Program"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. "About this program" (Editorial Split) */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-8">
            About this program
          </h2>
          <div className="flex flex-col gap-6 lg:border-l border-slate-200 lg:pl-12">
            <p className="text-lg text-slate-600 leading-relaxed">
              An intensive leadership development program for high-potential managers making the critical transition from operational management to strategic leadership, built on the Human Edge framework of Clarity, Energy, Trust, and Results.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              The program centres on real leadership application: building psychological safety, leading in human and AI-augmented environments, and exercising clear judgment under pressure. Participants leave with a practical 90-day leadership plan and a certificate awarded based on demonstrated application in real leadership contexts.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Who this program is built for & What you'll learn */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col gap-24">
          
          {/* Who it's built for */}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-8 text-center md:text-left">Who this program is built for</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {builtFor.map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
                  <Check className="text-blue-600 w-6 h-6 mb-4" />
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What you'll learn */}
          <div id="learn" className="flex flex-col gap-2 scroll-mt-28">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-8">What you&apos;ll learn</h2>
              <p className="text-lg text-slate-600 -mt-6 mb-8">Six concrete capabilities - built on your real situations, not case studies.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {capabilities.map((c, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
                  <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center mb-4">
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{c.title}</h3>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. Program Content (Accordion) */}
      <section id="modules" className="w-full max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-8">Program content</h2>
            <p className="text-lg text-slate-600 -mt-6 mb-8">
              <span className="font-semibold text-slate-900">Six modules over 12 weeks.</span> Each one applied to your real role between sessions.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <Accordion className="w-full">
              {modules.map((m, i) => (
                <AccordionItem
                  key={m.title}
                  value={m.title}
                  className="border-b border-slate-200 last:border-b-0 px-6 py-2"
                >
                  <AccordionTrigger className="text-slate-900 font-semibold text-lg hover:no-underline text-left [&>svg]:text-blue-600">
                    {m.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-base md:text-lg leading-relaxed pb-6">
                    {m.body}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 5. Final CTA Section (Dark Mode) */}
      <section className="w-full bg-slate-950 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Ready To Lead At The Next Level?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">
            Applications take five minutes, are reviewed individually, and we&apos;ll be in touch within a few days to confirm a fit.
          </p>
          <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 font-bold text-lg shadow-lg shadow-blue-600/30 transition-all inline-flex items-center justify-center">
            Apply For The Program
          </Link>
        </div>
      </section>
    </>
  );
}
