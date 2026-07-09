import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LOGOS = [
  { src: "/home/logos/harvard.png", alt: "Harvard Business School", h: "h-[40px] sm:h-[48px] md:h-[52px]" },
  { src: "/home/logos/ucd.png", alt: "University College Dublin", h: "h-[40px] sm:h-[48px] md:h-[52px]" },
  { src: "/home/logos/microsoft-logo-png-2396.png", alt: "Microsoft", h: "h-[32px] sm:h-[36px] md:h-[40px]" },
  { src: "/home/logos/red-hat-seeklogo.png", alt: "Red Hat", h: "h-[32px] sm:h-[36px] md:h-[40px]" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-36 pb-0 lg:pt-44">
      {/* Ambient canvas: soft color wash + fine grain for texture */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[130px] animate-[pulse_9s_ease-in-out_infinite]" />
      <div className="absolute top-24 right-[-15%] w-[760px] h-[760px] bg-indigo-400/10 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
      <div
        className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.08fr_1fr] lg:gap-12 lg:px-8">
        {/* Left Column: Typography & CTAs */}
        <div className="relative z-20 flex flex-col items-start justify-center text-left">
          
          {/* Eyebrow */}
          <span className="mb-6 block opacity-0 animate-fade-in-up text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-slate-500 [animation-delay:100ms]">
            FOR FOUNDERS & SENIOR EXECUTIVES
          </span>
          
          {/* H1 Headline */}
          <h1 className="opacity-0 animate-fade-in-up text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 leading-[1.05] [animation-delay:200ms]">
            Master the noise. Lead with{" "}
            <span className="font-serif italic font-normal text-blue-600">precision.</span>
          </h1>
          
          {/* Subtext */}
          <p className="mt-8 max-w-xl opacity-0 animate-fade-in-up text-lg md:text-xl text-slate-600 leading-relaxed [animation-delay:300ms]">
            The higher you climb, the less room there is for error. Strip away the operational chaos and focus purely on the strategic moves that actually drive growth.
          </p>
          
          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-8 opacity-0 animate-fade-in-up [animation-delay:400ms]">
            <Link 
              href="/contact"
              className="bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:scale-105 hover:bg-blue-600 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-300"
            >
              SECURE YOUR SPOT
            </Link>

            <Link
              href="/executive-coaching"
              className="group flex items-center gap-2 text-sm font-bold tracking-wide text-slate-900 uppercase hover:text-blue-600 transition-colors"
            >
              SEE HOW COACHING WORKS
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Column: Portrait, offset down slightly for an asymmetric rhythm */}
        <div className="relative z-10 w-full max-w-lg md:max-w-2xl mx-auto md:ml-auto opacity-0 animate-fade-in-scale [animation-delay:200ms] lg:mx-0 lg:mt-10">
          {/* Decorative rings, echoing the DecorRings motif used elsewhere on the page */}
          <div className="absolute -inset-6 -z-10 rounded-full border border-blue-500/15" aria-hidden="true" />
          <div className="absolute -inset-14 -z-10 hidden rounded-full border border-blue-500/10 sm:block" aria-hidden="true" />

          <Image
            src="/brand/vajira-avatar-zoomed.png"
            alt="Vajira Weerasekera"
            width={700}
            height={700}
            priority
            className="object-contain drop-shadow-2xl [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Floating proof card — breaks the grid, reinforces the 30+ years claim already in the subtext */}
          <div className="absolute bottom-10 -left-6 z-20 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.25)] backdrop-blur-md sm:-left-10 sm:px-6">
            <span className="font-accent text-3xl italic font-semibold text-blue-600">30+</span>
            <span className="max-w-[7rem] text-xs font-semibold uppercase leading-tight tracking-[0.08em] text-slate-500">
              Years leading global teams
            </span>
          </div>
        </div>
      </div>

      {/* Credibility — Static Premium Trust Bar */}
      <div className="relative z-10 mt-20 border-t border-slate-200/70 pt-16 pb-16 md:mt-28 md:pt-20 md:pb-20">
        <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-blue-600 text-center mb-10 md:mb-14 opacity-0 animate-fade-in-up [animation-delay:500ms]">
          TRUSTED BY LEADERS FROM
        </p>

        <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-14 sm:gap-16 md:gap-20 px-6">
          {LOGOS.map((logo, index) => (
            <div 
              key={logo.alt}
              className="flex items-center justify-center opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`w-auto object-contain animate-logo-spotlight ${logo.h}`}
                style={{ animationDelay: `${index * 3}s` }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
