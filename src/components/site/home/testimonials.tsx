"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { testimonials } from "@/lib/testimonials";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const SCROLL_SPEED = 0.5; // pixels per frame
const LOOP_COUNT = 3; 

export function Testimonials() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  
  const isHovered = useRef(false);
  const isPaused = useRef(false);
  const pauseTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const isDragging = useRef(false);
  const hoveredIndexRef = useRef<number | null>(null);

  // Duplicate the array to create a seamless infinite loop
  const items = Array(LOOP_COUNT).fill(testimonials).flat();

  const updateFocus = useCallback(() => {
    if (!containerRef.current || reduceMotion) return;
    const cards = containerRef.current.querySelectorAll('.testimonial-card-wrapper') as NodeListOf<HTMLElement>;
    const centerLine = window.innerWidth / 2;
    const hoveredIdx = hoveredIndexRef.current;
    const isActivelyScrolling = !isHovered.current && !isPaused.current && !isDragging.current;

    cards.forEach((card, idx) => {
      let factor;
      
      if (hoveredIdx !== null) {
        // Individual card focus mode
        factor = (idx === hoveredIdx) ? 0 : 1;
        if (idx === hoveredIdx) {
          card.style.setProperty('--card-scale', `1.02`);
        } else {
          card.style.setProperty('--card-scale', `${1 - (factor * 0.05)}`);
        }
      } else {
        // Default distance-based focus
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(centerLine - cardCenter);
        const maxDist = 450; 
        factor = Math.min(dist / maxDist, 1);
        card.style.setProperty('--card-scale', `${1 - (factor * 0.05)}`);
      }
      
      card.style.transitionProperty = 'filter, opacity, transform';
      card.style.transitionDuration = isActivelyScrolling ? '50ms' : '350ms';
      card.style.transitionTimingFunction = isActivelyScrolling ? 'linear' : 'ease-out';
      
      card.style.setProperty('--card-blur', `${factor * 2.5}px`);
      card.style.setProperty('--card-opacity', `${1 - (factor * 0.55)}`);
      card.style.setProperty('--card-grayscale', `${factor}`);
    });
  }, [reduceMotion]);

  const onLoop = useCallback(() => {
    if (!containerRef.current || reduceMotion) return;
    
    if (!isHovered.current && !isPaused.current && !isDragging.current) {
      containerRef.current.scrollLeft += SCROLL_SPEED;
      
      const container = containerRef.current;
      const singleSetWidth = container.scrollWidth / LOOP_COUNT;
      
      // Seamlessly jump back to prevent hitting the end
      if (container.scrollLeft >= singleSetWidth * 2) {
        container.scrollLeft -= singleSetWidth;
      }
    }
    
    updateFocus();
    requestRef.current = requestAnimationFrame(onLoop);
  }, [reduceMotion, updateFocus]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    // Detect mobile — disable auto-scroll blur system on touch devices
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (!mq.matches && !isMobile) {
      // Pause auto-scroll when section is off-screen to save CPU
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          isPaused.current = false;
        } else {
          isPaused.current = true;
        }
      });
      if (containerRef.current) observer.observe(containerRef.current);
      
      requestRef.current = requestAnimationFrame(onLoop);
      
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', checkMobile);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }
    return () => window.removeEventListener('resize', checkMobile);
  }, [onLoop, isMobile]);

  // Handle native scroll event to update focus when manually scrolling (e.g. trackpad/touch)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (isHovered.current || isPaused.current || reduceMotion || isDragging.current) {
        updateFocus();
      }
    };
    
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [updateFocus, reduceMotion]);

  // Initial setup
  useEffect(() => {
    if (containerRef.current && !reduceMotion) {
      const singleSetWidth = containerRef.current.scrollWidth / LOOP_COUNT;
      // Start at the beginning of the second set to allow immediate left-scrolling
      containerRef.current.scrollLeft = singleSetWidth;
      updateFocus();
    }
  }, [reduceMotion, updateFocus]);

  // Track active dot index on mobile via scroll
  useEffect(() => {
    if (!isMobile) return;
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const cardWidth = container.querySelector('.testimonial-card-wrapper')?.getBoundingClientRect().width || container.clientWidth * 0.85;
      const gap = 16;
      const index = Math.round(container.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, testimonials.length - 1));
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const handleArrowClick = (dir: 1 | -1) => {
    if (!containerRef.current) return;
    const cardWidth = containerRef.current.querySelector('.testimonial-card-wrapper')?.getBoundingClientRect().width || 480;
    const gap = window.innerWidth >= 640 ? 32 : 16; // sm:mr-8 (32px) or mr-4 (16px)
    const scrollAmount = cardWidth + gap;
    
    containerRef.current.scrollBy({ left: scrollAmount * dir, behavior: 'smooth' });
    
    // Pause auto-scroll for 4s after user interaction
    isPaused.current = true;
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => {
      isPaused.current = false;
    }, 4000);
  };

  return (
    <section className="relative bg-white pt-12 pb-12 md:pt-20 md:pb-20 mt-0 overflow-hidden">


      {/* Layer 3 & 2: Staggered Headline and Overlapping Glass Card */}
      <div className="relative z-10 mx-auto max-w-[1664px] px-6 sm:px-8 lg:px-[128px] pt-4 pb-8 md:pt-8 md:pb-12">
        <div className="max-w-4xl relative z-20 flex flex-col">
          {/* Layer 3: Staggered Headline */}
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight leading-[1.1] flex flex-col">
            <span className="text-slate-900 block">One architecture.</span>
            <span className="font-serif italic font-normal text-brand-blue block md:ml-32">Infinite scale.</span>
          </h2>
          
          {/* Layer 2: Editorial Feature Grid */}
          <div className="relative z-10 max-w-3xl mt-10 md:mt-16 md:ml-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:items-start">
            {/* Column 1: Summary & CTA */}
            <div className="flex flex-col gap-8">
              <p className="text-lg text-slate-500 leading-relaxed font-sans">
                I coach from experience, not theory. Over 30 years leading global teams as CTO at Microsoft and VP at Red Hat I've learned that performance follows clarity, energy, results and trust, not the other way round. Today I help boards, executives and emerging leaders build that same human edge in their own organisations.
              </p>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-brand-blue font-sans font-semibold w-fit transition-colors hover:text-blue-700"
              >
                Read the full story
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Column 2: 4 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="border-l border-slate-200 pl-4 flex flex-col">
                <span className="text-xs font-bold text-blue-600 mb-1">01</span>
                <span className="text-slate-900 font-semibold font-sans mb-1">Clarity</span>
                <p className="text-sm text-slate-500 font-sans">Cut through ambiguity and give people a clear line of sight to what matters.</p>
              </div>
              <div className="border-l border-slate-200 pl-4 flex flex-col">
                <span className="text-xs font-bold text-blue-600 mb-1">02</span>
                <span className="text-slate-900 font-semibold font-sans mb-1">Energy</span>
                <p className="text-sm text-slate-500 font-sans">Build environments that create momentum, not exhaustion.</p>
              </div>
              <div className="border-l border-slate-200 pl-4 flex flex-col">
                <span className="text-xs font-bold text-blue-600 mb-1">03</span>
                <span className="text-slate-900 font-semibold font-sans mb-1">Results</span>
                <p className="text-sm text-slate-500 font-sans">Turn sound judgement and trust into performance that lasts.</p>
              </div>
              <div className="border-l border-slate-200 pl-4 flex flex-col">
                <span className="text-xs font-bold text-blue-600 mb-1">04</span>
                <span className="text-slate-900 font-semibold font-sans mb-1">Trust</span>
                <p className="text-sm text-slate-500 font-sans">Create the psychological safety that lets people do their best work.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI-ERA LEADERSHIP SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-24 md:pt-12 md:pb-32">
        {/* 2-Column Grid: Stacks on mobile, splits 50/50 on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Headline */}
          <div className="flex flex-col">
            <h2 className="text-5xl md:text-6xl lg:text-[4rem] font-bold text-slate-900 tracking-tight leading-[1.05]">
              The Human Edge:<br />
              <span className="font-serif italic font-normal text-blue-600">the leadership advantage AI can't replace.</span>
            </h2>
          </div>

          {/* Right Column: Body Text */}
          {/* lg:pt-4 adds a slight top bump so the first line of the paragraph optically aligns with the top of the massive headline */}
          <div className="flex flex-col pt-8 border-t border-slate-200 lg:pt-4 lg:border-t-0 lg:border-l lg:pl-10">
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              Al can process information faster than any leader ever will. It can't build trust, read a room, or create the psychological safety that lets a team take risks and tell the truth. As Al reshapes how organisations work, the leaders who thrive won't be the ones with the most data they'll be the ones who bring clarity, judgement and human connection to decisions machines can't make.
            </p>
          </div>

        </div>
      </section>

      {/* The Testimonials Flow (Bottom) */}
      <div className="mx-auto flex flex-col gap-12 relative z-10">
        {/* Header container */}
        <div className="px-6 sm:px-10 lg:px-[128px] max-w-[1664px] mx-auto w-full text-center flex flex-col items-center">
          <h2 className="max-w-[760px] font-sans text-4xl font-bold leading-[1.18] tracking-tight text-slate-900 sm:text-5xl antialiased">
            <span className="font-serif italic font-normal text-blue-600">Proven</span>{" "}at the highest levels of leadership.
          </h2>
        </div>

        {/* Marquee Container */}
        <div 
          className="relative group w-full"
          onMouseEnter={() => { isHovered.current = true; }}
          onMouseLeave={() => { isHovered.current = false; }}
          onTouchStart={() => { isHovered.current = true; }}
          onTouchEnd={() => { isHovered.current = false; }}
        >
          {/* Edge Fades — hidden on mobile to show full card */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="hidden md:block absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={containerRef}
            className={cn(
              "flex overflow-x-auto [&::-webkit-scrollbar]:hidden py-8",
              isMobile
                ? "snap-x snap-mandatory px-4"
                : reduceMotion
                  ? "snap-x snap-mandatory px-6 sm:px-[calc(50vw-240px)]"
                  : "cursor-grab active:cursor-grabbing"
            )}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(isMobile ? testimonials : items).map((t, i) => (
              <div 
                key={`${t.name}-${i}`} 
                className={cn(
                  "testimonial-card-wrapper shrink-0 mr-4 sm:mr-8",
                  isMobile ? "snap-center" : reduceMotion ? "snap-center" : ""
                )}
                onMouseEnter={() => { if (!isMobile) hoveredIndexRef.current = i; }}
                onMouseLeave={() => { if (!isMobile && hoveredIndexRef.current === i) hoveredIndexRef.current = null; }}
                style={!reduceMotion && !isMobile ? {
                  filter: `blur(var(--card-blur, 0px))`,
                  opacity: `var(--card-opacity, 1)`,
                  transform: `scale(var(--card-scale, 1))`,
                  willChange: 'filter, opacity, transform'
                } : {}}
              >
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>

          {/* Navigation Arrows — hover-gated on desktop, always-visible on mobile */}
          <button
            onClick={() => handleArrowClick(-1)}
            className={cn(
              "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 flex items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300",
              isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100 hover:!scale-110"
            )}
            aria-label="Previous testimonials"
          >
            <ArrowLeft className="size-5" />
          </button>
          
          <button
            onClick={() => handleArrowClick(1)}
            className={cn(
              "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 flex items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300",
              isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100 hover:!scale-110"
            )}
            aria-label="Next testimonials"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>

        {/* Mobile dot indicators */}
        {isMobile && (
          <div className="flex items-center justify-center gap-2 mt-4 pb-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => {
                  const container = containerRef.current;
                  if (!container) return;
                  const cardWidth = container.querySelector('.testimonial-card-wrapper')?.getBoundingClientRect().width || container.clientWidth * 0.85;
                  container.scrollTo({ left: i * (cardWidth + 16), behavior: 'smooth' });
                }}
                className={cn(
                  "rounded-full transition-all duration-300",
                  activeIndex === i
                    ? "w-6 h-2 bg-blue-600"
                    : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
