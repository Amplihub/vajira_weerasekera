import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  style?: React.CSSProperties;
}

export function TestimonialCard({ testimonial, className, style }: TestimonialCardProps) {
  return (
    <figure 
      className={cn(
        "relative flex h-full w-[340px] sm:w-[480px] flex-col gap-8 rounded-[32px] p-8 sm:p-10",
        "bg-white/5 border border-white/10 overflow-hidden select-none",
        className
      )}
      style={style}
    >
      {/* Oversized Background Quote Mark */}
      <div 
        className="absolute top-2 right-4 text-[160px] leading-none text-brand-blue/10 font-heading font-black pointer-events-none z-0"
        aria-hidden="true"
      >
        ”
      </div>

      <blockquote className="relative z-10 flex-1 text-[15px] sm:text-[17px] leading-relaxed text-brand-bg/90 font-medium">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      
      <div className="relative z-10 flex items-center gap-4 mt-auto">
        <div className="relative size-14 sm:size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 bg-brand-navy/50">
          <Image 
            src={testimonial.image} 
            alt={testimonial.name} 
            fill 
            sizes="(max-width:640px) 56px, 64px" 
            className="object-cover object-top"
            style={{ filter: "grayscale(var(--card-grayscale, 1))" }}
            draggable={false}
          />
        </div>
        <figcaption className="flex min-w-0 flex-col gap-0.5 pt-1">
          <span className="truncate text-[13px] sm:text-sm font-semibold uppercase tracking-[0.5px] text-brand-bg">
            {testimonial.name}
          </span>
          <span className="line-clamp-2 text-[12px] sm:text-[13px] leading-relaxed text-brand-bg/60 pr-4">
            {testimonial.role}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
