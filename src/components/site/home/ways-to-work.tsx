"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PROGRAMS = [
  {
    id: "coaching",
    title: "Executive Coaching",
    desc: "1:1 sessions for senior leaders",
  },
  {
    id: "keynotes",
    title: "Keynote Speaking",
    desc: "Practical insights for the AI era",
  },
  {
    id: "emerging",
    title: "Emerging Executives Program",
    desc: "Transition to strategic leadership",
  },
  {
    id: "leadership",
    title: "Leadership Programs",
    desc: "Align and reset your leadership team",
  },
];

export function WaysToWork() {
  const [inView, setInView] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Parallax logic
    const onScroll = () => {
      if (mq.matches || !parallaxRef.current) return;
      const rect = parallaxRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      // Move slightly slower than scroll (offset is opposite to scroll direction)
      const offset = (elementCenter - viewportCenter) * 0.05;
      parallaxRef.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // For reduced motion, elements are immediately visible and tags are expanded.
  const showElements = inView || reduceMotion;
  const parallaxRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" ref={sectionRef} className="relative overflow-hidden bg-brand-navy scroll-mt-28">
      {/* Subtle Film Grain Texture */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-12 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:px-[128px] lg:py-20 z-10">
        {/* Left: Vajira image (enlarged, duotone, linear mask, parallax) */}
        <div 
          className={cn(
            "relative mx-auto aspect-[4/5] w-full max-w-[500px] shrink-0 lg:mx-0 lg:-ml-24 lg:max-w-[600px]",
            !reduceMotion && !inView ? "opacity-0" : "animate-fade-in-up"
          )}
        >
          {/* Connecting Thread (Desktop Only) */}
          <div className="absolute top-[40%] left-[80%] w-[300px] h-[80px] z-0 hidden lg:block overflow-visible pointer-events-none">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
              <path 
                d="M 0 60 C 120 60 180 20 300 20" 
                fill="none" 
                stroke="#3d8bf2" 
                strokeWidth="1" 
                className={cn("opacity-40", !reduceMotion && !inView ? "opacity-0" : "animate-draw-line [animation-delay:400ms] motion-reduce:animate-none")}
              />
            </svg>
          </div>

          {/* Photo with soft organic mask to completely eliminate hard edges */}
          <div 
            ref={parallaxRef}
            className="relative w-full h-full [mask-image:radial-gradient(closest-side,black_40%,transparent_100%)] -webkit-[mask-image:radial-gradient(closest-side,black_40%,transparent_100%)]"
          >
            <div className="absolute inset-0 bg-brand-blue mix-blend-color opacity-30 z-10 pointer-events-none" />
            <Image
              src="/home/ways/Vajira_ways_to_work.png"
              alt="Vajira Weerasekera"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-top mix-blend-luminosity opacity-85 contrast-125 grayscale"
            />
          </div>
        </div>

        {/* Right: heading + tag row + CTA */}
        <div className="flex flex-col gap-10 relative z-10 w-full lg:max-w-2xl">
          <h2 
            className={cn(
              "font-heading text-3xl font-semibold leading-tight tracking-[-0.5px] text-brand-bg sm:text-5xl antialiased",
              !reduceMotion && !inView ? "opacity-0" : "animate-fade-in-up [animation-delay:150ms]"
            )}
          >
            <span className="text-brand-bg/60">Ways to work with Vajira,</span>
            <br /> from coaching to full leadership programs.
          </h2>

          <div className="flex flex-col gap-3">
            {PROGRAMS.map((program, index) => {
              const isExpanded = reduceMotion || expandedId === program.id;
              
              return (
                <div
                  key={program.id}
                  onMouseEnter={() => !reduceMotion && setExpandedId(program.id)}
                  onClick={() => !reduceMotion && setExpandedId(program.id)}
                  className={cn(
                    "group cursor-pointer rounded-2xl border transition-all duration-250 ease-out overflow-hidden",
                    isExpanded ? "border-brand-blue/40 bg-brand-blue/5" : "border-white/15 hover:border-white/25",
                    !reduceMotion && !inView ? "opacity-0" : "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${250 + (index * 60)}ms` }}
                >
                  <div className="px-6 py-4 flex flex-col gap-1">
                    <span className={cn(
                      "text-base font-medium transition-colors duration-250",
                      isExpanded ? "text-brand-bg" : "text-brand-bg/80"
                    )}>
                      {program.title}
                    </span>
                    <div 
                      className={cn(
                        "grid transition-all duration-250 ease-out",
                        isExpanded ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <p className="overflow-hidden text-sm text-brand-bg/60">
                        {program.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "mt-8 flex",
              !reduceMotion && !inView ? "opacity-0" : "animate-fade-in-up [animation-delay:550ms]"
            )}
          >
            <Link 
              href="#book-a-call" 
              className={cn(
                "group relative inline-flex w-fit items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-semibold text-brand-bg transition-all duration-200 ease-out",
                "bg-brand-blue/20 motion-safe:animate-pulse-glow motion-reduce:animate-none motion-reduce:shadow-[0_0_15px_rgba(61,139,242,0.25)]",
                "hover:bg-brand-blue hover:!shadow-[0_0_25px_4px_rgba(61,139,242,0.5)] hover:animate-none"
              )}
            >
              Book a discovery call
              <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-[5px] motion-safe:animate-nudge-cta motion-reduce:animate-none group-hover:animate-none" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
