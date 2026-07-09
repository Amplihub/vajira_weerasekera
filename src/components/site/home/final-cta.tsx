"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BOOK_CALL_HREF } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

export function FinalCta() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={ref} 
      className="relative overflow-hidden bg-slate-950 border-t border-slate-900 py-32 md:py-48 flex flex-col items-center justify-center"
    >
      {/* Ambient Animation Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center px-6 sm:px-10">
        <h2 
          className={cn(
            "font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white transition-all duration-1000 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Stop managing the chaos. Start engineering the <span className="font-serif italic font-normal text-blue-500">future.</span>
        </h2>
        
        <p 
          className={cn(
            "text-slate-400 text-lg md:text-xl mt-6 transition-all duration-1000 ease-out delay-200",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Step out of the operational weeds and into your highest strategic leverage.
        </p>
        
        <div
          className={cn(
            "transition-all duration-1000 ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: inView ? "400ms" : "0ms" }}
        >
          <Link
            href={BOOK_CALL_HREF}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
          >
            INITIATE THE CONVERSATION
            <ArrowRight className="size-5 transition-transform duration-300 ease-out group-hover:translate-x-2" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

