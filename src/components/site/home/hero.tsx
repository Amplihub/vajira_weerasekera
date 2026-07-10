import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-8 sm:pt-36 lg:pt-44 pb-4 md:pb-8">
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

      <div className="relative z-10 mx-auto flex flex-col lg:flex-row max-w-7xl items-center gap-8 sm:gap-16 px-4 sm:px-6 lg:gap-8 lg:px-8 mb-10 md:mb-16">
        {/* Left Column: Typography & CTAs — second on mobile, first on desktop */}
        <div className="order-2 lg:order-none relative z-20 flex flex-col items-start justify-center text-left lg:w-1/2 flex-shrink">
          
          {/* Eyebrow */}
          <span className="mb-6 block opacity-0 animate-fade-in-up text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-slate-500 [animation-delay:100ms]">
            FOR FOUNDERS & SENIOR EXECUTIVES
          </span>
          
          {/* H1 Headline */}
          <h1 className="opacity-0 animate-fade-in-up text-[2.6rem] leading-[1.1] sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 [animation-delay:200ms]">
            Master the noise. Lead{" "}
            <span className="whitespace-nowrap">with{" "}
              <span className="font-serif italic font-normal text-blue-600">Clarity.</span>
            </span>
          </h1>
          
          {/* Subtext */}
          <p className="mt-8 max-w-xl opacity-0 animate-fade-in-up text-lg md:text-xl text-slate-600 leading-relaxed [animation-delay:300ms]">
            Executive coaching, keynotes and leadership programs for leaders navigating complexity, change built on 30 years leading global teams at Microsoft and Red Hat. and the age of Al
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

        {/* RIGHT COLUMN: HERO IMAGE (BULLETPROOF LAYOUT) */}
        {/* flex-shrink-0 prevents the text column from crushing this column */}
        <div className="relative w-full lg:w-1/2 flex-shrink-0 flex items-center justify-center lg:justify-end mt-12 lg:mt-0">

          {/* Master Sizing Container: Fills the column, scales up, and shifts right */}
          <div className="relative w-full lg:w-full lg:max-w-[650px] xl:max-w-[700px] lg:translate-x-8 xl:translate-x-12 transition-transform duration-700">

            {/* 1. Desktop Decorative Rings & Pulse Glow */}
            <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-none">

              {/* Soft pulsing ambient glow behind the image (gives volume to the animation) */}
              <div className="absolute inset-0 rounded-full bg-blue-100/40 blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>

              {/* Ring 1 (Inner): Tighter, more visible border */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[112%] aspect-square rounded-full border-[1.5px] border-slate-300/70 animate-[pulse_3s_ease-in-out_infinite]"></div>

              {/* Ring 2 (Middle): Delayed pulse */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[126%] aspect-square rounded-full border-[1.5px] border-slate-200/70 animate-[pulse_3s_ease-in-out_infinite] [animation-delay:1s]"></div>

              {/* Ring 3 (Outer): Widest ring, furthest delay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square rounded-full border-[1.5px] border-slate-200/40 animate-[pulse_3s_ease-in-out_infinite] [animation-delay:2s]"></div>

            </div>

            {/* 2. Responsive Image Wrapper */}
            {/* Mobile: 450px tall, edge-to-edge fade. Desktop: Massive fluid circle. */}
            <div className="relative w-full h-[450px] lg:h-auto lg:aspect-square rounded-none lg:rounded-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] lg:[mask-image:none] shadow-none lg:shadow-2xl lg:shadow-slate-200/60 z-10">
              <Image
                src="/brand/vajira-avatar-zoomed.png"
                alt="Vajira Weerasekera"
                fill
                priority
                className="w-full h-full object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* 3. The 30+ Years Badge */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:bottom-16 lg:left-[-10%] lg:translate-x-0 z-20 flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-full px-5 py-3 shadow-xl border border-white/50 w-max transform lg:scale-110 origin-bottom-left">
              <span className="text-blue-600 font-serif italic text-2xl font-bold">30+</span>
              <span className="text-xs font-bold tracking-widest uppercase text-slate-500 leading-tight">
                Years Leading<br />Global Teams
              </span>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
