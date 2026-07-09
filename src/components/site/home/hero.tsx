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
    <section className="relative overflow-hidden bg-slate-50 pt-40 sm:pt-36 lg:pt-44 pb-0">
      {/* Ambient canvas: soft color wash + fine grain for texture */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[130px] animate-[pulse_9s_ease-in-out_infinite]" />
      <div className="absolute top-24 right-[-15%] w-[760px] h-[760px] bg-indigo-400/10 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
      <div
        className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mobile-only ambient drifting gradient — GPU-accelerated via transform only */}
      <div className="md:hidden absolute inset-0 -z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-400/10 blur-[80px] animate-[mobile-drift-a_14s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-indigo-300/10 blur-[80px] animate-[mobile-drift-b_18s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 sm:gap-16 px-4 sm:px-6 lg:grid-cols-[1.08fr_1fr] lg:gap-12 lg:px-8">
        {/* Left Column: Typography & CTAs — second on mobile, first on desktop */}
        <div className="order-2 lg:order-none relative z-20 flex flex-col items-start justify-center text-left">
          
          {/* Eyebrow */}
          <span className="mb-6 block opacity-0 animate-fade-in-up text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-slate-500 [animation-delay:100ms]">
            FOR FOUNDERS & SENIOR EXECUTIVES
          </span>
          
          {/* H1 Headline */}
          <h1 className="opacity-0 animate-fade-in-up text-[2.6rem] leading-[1.1] sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 [animation-delay:200ms]">
            Master the noise. Lead with{" "}
            <span className="font-serif italic font-normal text-blue-600">precision.</span>
          </h1>
          
          {/* Subtext */}
          <p className="mt-8 max-w-xl opacity-0 animate-fade-in-up text-lg md:text-xl text-slate-600 leading-relaxed [animation-delay:300ms]">
            The higher you climb, the less room there is for error. Strip away the operational chaos and focus purely on the strategic moves that actually drive growth.
          </p>
          
          {/* Actions */}
          <div className="mt-8 flex flex-row flex-wrap items-center gap-3 sm:gap-8 opacity-0 animate-fade-in-up [animation-delay:400ms]">
            <Link 
              href="/contact"
              className="min-h-[44px] flex items-center bg-slate-900 text-white px-6 sm:px-8 py-3 rounded-full text-sm font-bold tracking-wide hover:scale-105 hover:bg-blue-600 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-300"
            >
              SECURE YOUR SPOT
            </Link>

            <Link
              href="/executive-coaching"
              className="group min-h-[44px] flex items-center gap-2 text-sm font-bold tracking-wide uppercase transition-all duration-300
                px-5 py-3 rounded-full border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white
                sm:border-0 sm:px-0 sm:py-0 sm:rounded-none sm:hover:bg-transparent sm:hover:text-blue-600"
            >
              SEE HOW COACHING WORKS
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Column: Portrait — first on mobile (premium frame), second on desktop (floating) */}
        <div
          className={[
            // Ordering
            "order-1 lg:order-none",
            // Shared base
            "relative z-10 w-full opacity-0 animate-fade-in-scale [animation-delay:150ms]",
            // Desktop: revert to the original floating style
            "sm:rounded-none sm:overflow-visible sm:shadow-none sm:border-0 sm:bg-transparent",
            // Sizing
            "mx-auto max-w-full sm:max-w-lg md:max-w-2xl md:ml-auto lg:mx-0 lg:mt-10",
          ].join(" ")}
        >

          {/* ── MOBILE FRAME ONLY ─────────────────────────────────────────── */}
          {/* Outer floating shadow container */}
          <div className="sm:hidden relative mx-3"
            style={{ filter: "drop-shadow(0 32px 60px rgba(61,139,242,0.18)) drop-shadow(0 8px 20px rgba(15,23,42,0.10))" }}
          >
            {/* Ambient radial glow behind subject's head — z-0 ensures it sits behind image */}
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[70%] h-[55%] rounded-full bg-blue-400/20 blur-[50px] pointer-events-none z-0" aria-hidden="true" />
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[45%] h-[35%] rounded-full bg-blue-300/15 blur-[35px] pointer-events-none z-0" aria-hidden="true" />

            {/* Decorative rings — z-0, behind everything */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[85%] aspect-square rounded-full border border-blue-500/15 pointer-events-none z-0" aria-hidden="true" />
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[95%] aspect-square rounded-full border border-blue-400/10 pointer-events-none z-0" aria-hidden="true" />

            {/* Frame container: rounded top, open bottom, gradient border via inset box-shadow */}
            <div
              className="relative overflow-hidden rounded-t-[32px] rounded-b-none"
              style={{
                background: "linear-gradient(160deg, #eef4ff 0%, #f5f8ff 40%, #f8faff 100%)",
                boxShadow: "inset 0 0 0 1px rgba(61,139,242,0.25), inset 1px 0 0 rgba(61,139,242,0.15)",
              }}
            >
              <Image
                src="/brand/vajira-avatar-zoomed.png"
                alt="Vajira Weerasekera"
                width={700}
                height={700}
                priority
                className="relative z-10 w-full object-contain [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
                sizes="(max-width: 640px) 100vw, 50vw"
              />

              {/* Credential badge — pinned inside bottom-left of frame */}
              <div className="absolute bottom-6 left-4 z-20 flex items-center gap-2.5 rounded-xl border border-white/80 bg-white/85 px-3.5 py-2.5 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.20)] backdrop-blur-sm">
                <span className="font-accent text-2xl italic font-semibold text-blue-600">30+</span>
                <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-slate-500">
                  Years leading<br />global teams
                </span>
              </div>
            </div>
          </div>

          {/* ── DESKTOP: original floating photo (unchanged) ─────────────── */}
          <div className="hidden sm:block relative">
            {/* Decorative rings */}
            <div className="absolute -inset-6 -z-10 rounded-full border border-blue-500/15" aria-hidden="true" />
            <div className="absolute -inset-14 -z-10 hidden sm:block rounded-full border border-blue-500/10" aria-hidden="true" />

            <Image
              src="/brand/vajira-avatar-zoomed.png"
              alt="Vajira Weerasekera"
              width={700}
              height={700}
              priority
              className="object-contain drop-shadow-2xl [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Floating proof card — desktop/tablet only */}
            <div className="hidden sm:flex absolute bottom-10 -left-10 z-20 items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.25)] backdrop-blur-md">
              <span className="font-accent text-3xl italic font-semibold text-blue-600">30+</span>
              <span className="max-w-[7rem] text-xs font-semibold uppercase leading-tight tracking-[0.08em] text-slate-500">
                Years leading global teams
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Credibility — Trust Bar */}
      <div className="relative z-10 mt-16 sm:mt-20 border-t border-slate-200/70 pt-10 pb-10 sm:pt-16 sm:pb-16 md:mt-28 md:pt-20 md:pb-20">
        <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-blue-600 text-center mb-6 sm:mb-10 md:mb-14 opacity-0 animate-fade-in-up [animation-delay:500ms]">
          TRUSTED BY LEADERS FROM
        </p>

        {/* Mobile: single-line looping marquee */}
        <div className="sm:hidden overflow-hidden relative">
          {/* Left/right edge fades */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="flex w-max animate-marquee items-center gap-12 motion-reduce:animate-none">
            {[...LOGOS, ...LOGOS].map((logo, index) => (
              <div key={index} className="shrink-0 flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`w-auto object-contain opacity-50 grayscale ${logo.h}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: static grid */}
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-16 md:gap-20 px-6">
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
