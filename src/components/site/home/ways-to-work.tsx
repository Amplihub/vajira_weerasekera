"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PROGRAMS = [
  {
    id: "coaching",
    title: "Executive Coaching (1:1)",
    desc: "One-on-one coaching for senior leaders navigating high-stakes decisions, transitions, or team performance challenges.",
    linkText: "Explore advisory \u2192",
    linkHref: "/executive-coaching",
  },
  {
    id: "keynotes",
    title: "Strategic Keynotes",
    desc: "Keynote talks on human-centred leadership, psychological safety and leading through the AI era built for conferences, offsites and leadership summits.",
    linkText: "See speaking topics \u2192",
    linkHref: "/speaking",
  },
  {
    id: "emerging",
    title: "Emerging Leaders Program",
    desc: "A structured program helping high-potential leaders build the judgement, clarity and presence to step into bigger roles.",
    linkText: "View program details \u2192",
    linkHref: "/emerging-leaders",
  },
  {
    id: "leadership",
    title: "Executive Offsites",
    desc: "Facilitated offsites that align leadership teams around a shared framework for decision-making, trust and performance.",
    linkText: "Explore team programs \u2192",
    linkHref: "/programs",
  },
];

export function WaysToWork() {
  const [inView, setInView] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>("coaching");
  const [reduceMotion, setReduceMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="services" ref={sectionRef} className="relative overflow-hidden bg-brand-navy scroll-mt-32 pt-16 pb-16 md:pt-24 md:pb-24 mb-0">
      {/* Subtle Film Grain Texture */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto flex max-w-[1664px] flex-col gap-12 px-6 sm:px-8 lg:flex-row lg:items-center lg:gap-20 lg:px-[128px] z-10">
        {/* Left: Vajira image (Cinematic Emergence) */}
        <div 
          className={cn(
            "relative mx-auto w-full max-w-[480px] shrink-0 lg:mx-0 lg:-ml-12 lg:max-w-[550px] min-h-[600px] flex flex-col justify-end",
            !reduceMotion && !inView ? "opacity-0" : "animate-fade-in-up"
          )}
        >
          {/* Studio Lighting */}
          <div className="absolute top-0 -right-10 w-[80%] h-[80%] bg-blue-600/20 blur-[100px] rounded-full z-0 pointer-events-none" />

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

          {/* Portrait Container with Heavy CSS Mask */}
          <div 
            ref={parallaxRef}
            className="relative w-full z-10"
            style={{ 
              WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)"
            }}
          >
            <Image
              src="/home/ways/Vajira_ways_to_work.png"
              alt="Vajira Weerasekera"
              width={600}
              height={800}
              sizes="(max-width: 1024px) 100vw, 600px"
              className="w-full h-auto object-bottom opacity-90 contrast-110"
            />
          </div>

          {/* Floating Glass Badges */}
          {/* Badge 1: Top Right */}
          <div 
            className="absolute top-[15%] right-0 lg:-right-12 z-20 flex items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 shadow-xl animate-pulse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="text-sm font-medium text-white tracking-wide">30+ Years Leading</span>
          </div>

          {/* Badge 2: Bottom Left */}
          <div 
            className="absolute bottom-[30%] left-0 lg:-left-8 z-20 flex items-center gap-2.5 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 shadow-xl animate-pulse [animation-delay:1s]"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-sm font-medium text-white tracking-wide">Microsoft & Red Hat</span>
          </div>
        </div>

        {/* Right: heading + Premium Accordion + CTA */}
        <div className="flex flex-col gap-12 relative z-10 w-full lg:max-w-2xl pt-8 lg:pt-0">
          <h2
            className={cn(
              "font-sans text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-[3.5rem] antialiased",
              !reduceMotion && !inView ? "opacity-0" : "animate-fade-in-up [animation-delay:150ms]"
            )}
          >
            Ways to engage. Precision interventions for high-stakes <span className="font-serif italic font-normal text-brand-blue">leadership.</span>
          </h2>

          <div className="flex flex-col w-full border-t border-white/10">
            {PROGRAMS.map((program, index) => {
              const isExpanded = reduceMotion || expandedId === program.id;
              
              return (
                <div
                  key={program.id}
                  onMouseEnter={() => !reduceMotion && setExpandedId(program.id)}
                  onClick={() => !reduceMotion && setExpandedId(program.id)}
                  className={cn(
                    "group cursor-pointer border-b border-white/10 py-6 transition-all duration-500 ease-out",
                    !reduceMotion && !inView ? "opacity-0" : "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${250 + (index * 60)}ms` }}
                >
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-6">
                        <span className="font-sans text-sm font-semibold tracking-widest text-brand-blue">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className={cn(
                          "text-2xl sm:text-3xl font-medium tracking-tight transition-colors duration-500",
                          isExpanded ? "text-white" : "text-white/60 group-hover:text-white/90"
                        )}
                        >
                          {program.title}
                        </h3>
                     </div>
                  </div>
                  <div 
                    className={cn(
                      "grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden pl-[3.25rem] sm:pl-[3.5rem]"> 
                      <div className="pt-5 pb-2 flex flex-col gap-4">
                        <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-light">
                          {program.desc}
                        </p>
                        <Link 
                          href={program.linkHref}
                          className="inline-flex items-center text-sm font-bold text-brand-blue hover:text-white transition-colors duration-300 w-fit"
                        >
                          {program.linkText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              "mt-4 flex",
              !reduceMotion && !inView ? "opacity-0" : "animate-fade-in-up [animation-delay:550ms]"
            )}
          >
            <Link 
              href="/contact" 
              className={cn(
                "group relative inline-flex w-fit items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-semibold text-white transition-all duration-300 ease-out",
                "bg-brand-blue hover:bg-[#2c75d3] hover:scale-[1.02] hover:shadow-[0_0_24px_-4px_rgba(61,139,242,0.6)]"
              )}
            >
              Book a discovery call
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
