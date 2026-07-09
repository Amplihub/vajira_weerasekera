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

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 sm:gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:gap-8 lg:px-8 mb-10 md:mb-16">
        {/* Left Column: Typography & CTAs — second on mobile, first on desktop */}
        <div className="order-2 lg:order-none relative z-20 flex flex-col items-start justify-center text-left">
          
          {/* Eyebrow */}
          <span className="mb-6 block opacity-0 animate-fade-in-up text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-slate-500 [animation-delay:100ms]">
            FOR FOUNDERS & SENIOR EXECUTIVES
          </span>
          
          {/* H1 Headline */}
          <h1 className="opacity-0 animate-fade-in-up text-[2.6rem] leading-[1.1] sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 [animation-delay:200ms]">
            Master the noise. Lead{" "}
            <span className="whitespace-nowrap">with{" "}
              <span className="font-serif italic font-normal text-blue-600">precision.</span>
            </span>
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

        {/* IMAGE COLUMN REBUILD */}
        <div className="relative flex items-center justify-center w-full md:w-1/2 mt-2 md:mt-0">

          {/* 1. Desktop Decorative Rings (Strictly hidden on mobile) */}
          <div className="hidden md:block absolute inset-[-15%] rounded-full border border-blue-500/15 animate-ring-pulse z-0 pointer-events-none" aria-hidden="true" />
          <div className="hidden md:block absolute inset-[-30%] rounded-full border border-blue-500/10 animate-ring-pulse [animation-delay:1.5s] z-0 pointer-events-none" aria-hidden="true" />

          {/* 2. Responsive Image Wrapper */}
          {/* Mobile: Full width, fixed height, no rounding, bottom fade mask */}
          {/* Desktop: Max-width, square, fully rounded circle, no mask, shadow */}
          <div className="relative w-full h-[450px] md:h-auto md:max-w-[530px] md:aspect-square rounded-none md:rounded-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)] md:[mask-image:none] shadow-none md:shadow-2xl md:shadow-slate-200/60 z-10 mx-auto md:scale-[1.18] md:translate-x-12">
            <Image
              src="/brand/vajira-avatar-zoomed.png"
              alt="Vajira Weerasekera"
              fill
              priority
              className="w-full h-full object-cover object-[center_top]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* 3. The 30+ Years Badge */}
          {/* Mobile: Centered at the bottom of the image */}
          {/* Desktop: Offset to the bottom-left of the circle */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:bottom-12 md:left-[-10%] md:translate-x-0 z-20 flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-full px-5 py-3 shadow-xl border border-white/50 w-max">
            <span className="font-accent text-xl italic font-semibold text-blue-600">30+</span>
            <span className="text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-slate-500">
              Years Leading<br />Global Teams
            </span>
          </div>

        </div>
      </div>

    </section>
  );
}
