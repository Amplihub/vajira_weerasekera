import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Leadership Programs — Vajira Weerasekera",
  description: "Structured leadership development programs that move senior leaders from doing to leading, with the judgment and presence the next role expects.",
};

const programs = [
  {
    available: true,
    image: "/home/emerging-image.png",
    title: "Emerging Leaders Program",
    body: "An intensive development program for high-potential managers making the critical transition from operational management to strategic leadership. Built on the Human Edge framework.",
    learnMore: "/emerging-leaders",
  },
  {
    available: false,
    title: "Manager Coaching Series",
    body: "A structured group coaching program for mid-level managers seeking to strengthen their leadership fundamentals - communication, delegation, feedback, and team development.",
  },
  {
    available: false,
    title: "Executive Offsites",
    body: "Bespoke facilitated offsites for leadership teams looking to align on strategy, reset team dynamics, or navigate a major transition. Designed and delivered to your specific context.",
  },
];

const customPoints = [
  "Built around your context",
  "Run on the Human Edge framework",
  "Designed in partnership with you"
];

export default function ProgramsPage() {
  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative w-full bg-white overflow-hidden py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column (Text) */}
          <div className="flex flex-col gap-8 w-full max-w-xl z-10">
            <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
              All Programs
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-bold text-slate-900 tracking-tight leading-[1.05]">
              Our <span className="font-serif italic font-normal text-blue-600">Leadership</span><br />Development Programs
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Twelve weeks from now, you&apos;ve moved out of the doing and into leading, with the judgment and presence the next role expects you to have.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <a href="#programs" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-3.5 font-semibold transition-all inline-flex items-center justify-center">
                View available programs
              </a>
              <Link href="/contact" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-full px-8 py-3.5 font-semibold transition-all inline-flex items-center justify-center">
                Book your call
              </Link>
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
                  src="/home/programs-portrait.png"
                  alt="Leadership Programs"
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

      {/* 2. The Programs Grid (3 Cards) */}
      <section id="programs" className="w-full bg-slate-50 py-16 md:py-24 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {programs.map((p) => (
              <article key={p.title} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                {/* Visual */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                  {p.available && p.image ? (
                    <Image src={p.image} alt={p.title} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-slate-50">
                      <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Lock className="w-8 h-8" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
                  <span className={
                      p.available
                        ? "w-fit text-sm font-semibold text-blue-600 uppercase tracking-wider"
                        : "w-fit rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500 uppercase tracking-wider"
                    }
                  >
                    {p.available ? "Available" : "Coming Soon"}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{p.title}</h3>
                  <p className="text-slate-600 leading-relaxed flex-grow">{p.body}</p>

                  {p.available && (
                    <div className="mt-4 flex flex-col gap-3">
                      <Link href={p.learnMore ?? "#"} className="w-full inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-full px-6 py-3 font-semibold transition-all">
                        Learn more
                      </Link>
                      <Link href="/contact" className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 py-3 font-semibold transition-all">
                        Book a free call
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. "Need a Custom Program" Section (Editorial Layout) */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Need a <span className="font-serif italic font-normal text-blue-600">Custom</span><br />program built for you?
            </h2>
            <Link href="/contact" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-3.5 font-semibold transition-all inline-flex items-center justify-center w-fit">
              Request a custom course
            </Link>
          </div>

          <div className="lg:border-l border-slate-200 lg:pl-12 flex flex-col space-y-6">
            {customPoints.map((p) => (
              <div key={p} className="flex items-start gap-4">
                <Check className="text-blue-600 w-6 h-6 flex-shrink-0 mt-1" />
                <span className="text-lg text-slate-700 font-medium">{p}</span>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="w-full bg-slate-950 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Stop managing the chaos. Start engineering the <span className="font-serif italic font-normal text-blue-500">future.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">
            Step out of the operational weeds and into your highest strategic leverage.
          </p>
          <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 font-bold text-lg inline-flex items-center justify-center">
            Book a call
          </Link>
        </div>
      </section>
    </>
  );
}
