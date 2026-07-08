"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { testimonials } from "@/lib/testimonials";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_SPEED = 0.5; // pixels per frame
const LOOP_COUNT = 3; 

export function Testimonials() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  
  const isHovered = useRef(false);
  const isPaused = useRef(false);
  const pauseTimeout = useRef<NodeJS.Timeout>();
  const isDragging = useRef(false);

  // Duplicate the array to create a seamless infinite loop
  const items = Array(LOOP_COUNT).fill(testimonials).flat();

  const updateFocus = useCallback(() => {
    if (!containerRef.current || reduceMotion) return;
    const cards = containerRef.current.querySelectorAll('.testimonial-card-wrapper') as NodeListOf<HTMLElement>;
    const centerLine = window.innerWidth / 2;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(centerLine - cardCenter);
      
      // Calculate focus factor: 0 is center, 1 is far edge
      const maxDist = 450; 
      const factor = Math.min(dist / maxDist, 1);
      
      // Map to CSS variables for smooth transition
      card.style.setProperty('--card-blur', `${factor * 2.5}px`);
      card.style.setProperty('--card-opacity', `${1 - (factor * 0.55)}`);
      card.style.setProperty('--card-grayscale', `${factor}`);
      card.style.setProperty('--card-scale', `${1 - (factor * 0.05)}`);
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
    
    if (!mq.matches) {
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
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }
  }, [onLoop]);

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
    <section className="bg-brand-navy overflow-hidden">
      <div className="mx-auto flex flex-col gap-12 py-20 lg:py-[140px]">
        {/* Header container */}
        <div className="px-6 sm:px-10 lg:px-[128px] max-w-[1664px] mx-auto w-full">
          <h2 className="max-w-[760px] font-heading text-4xl font-semibold leading-[1.12] tracking-[-0.5px] text-brand-bg sm:text-5xl antialiased">
            <span className="text-brand-blue">Trusted</span>{" "}by leaders who&apos;ve worked with him
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
          {/* Edge Fades for smooth entry/exit */}
          <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-brand-navy to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-brand-navy to-transparent z-10 pointer-events-none" />

          <div
            ref={containerRef}
            className={cn(
              "flex overflow-x-auto [&::-webkit-scrollbar]:hidden py-8",
              reduceMotion ? "snap-x snap-mandatory px-6 sm:px-[calc(50vw-240px)]" : "cursor-grab active:cursor-grabbing"
            )}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((t, i) => (
              <div 
                key={`${t.name}-${i}`} 
                className={cn(
                  "testimonial-card-wrapper shrink-0 transition-[filter,opacity,transform] duration-[50ms] ease-linear mr-4 sm:mr-8",
                  reduceMotion ? "snap-center" : ""
                )}
                style={!reduceMotion ? {
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

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4 px-6 relative z-20">
            <button
              type="button"
              onClick={() => handleArrowClick(-1)}
              aria-label="Previous testimonial"
              className="flex size-14 items-center justify-center rounded-full bg-brand-blue/15 text-brand-bg transition-colors hover:bg-brand-blue"
            >
              <ArrowLeft className="size-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => handleArrowClick(1)}
              aria-label="Next testimonial"
              className="flex size-14 items-center justify-center rounded-full bg-brand-blue/15 text-brand-bg transition-colors hover:bg-brand-blue"
            >
              <ArrowRight className="size-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
