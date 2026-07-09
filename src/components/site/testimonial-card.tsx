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
        "relative flex h-full w-[340px] sm:w-[480px] flex-col gap-8 rounded-2xl p-8 md:p-12",
        "bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden select-none",
        className
      )}
      style={style}
    >
      {/* Oversized background quote mark — brightens on the focused/centered card, recedes on blurred side cards */}
      <div
        className="absolute top-2 right-4 text-[160px] leading-none text-brand-blue font-heading font-black pointer-events-none z-0 transition-opacity duration-[50ms] ease-linear"
        style={{ opacity: `calc(var(--card-opacity, 1) * 0.1)` }}
        aria-hidden="true"
      >
        ”
      </div>

      <blockquote className="relative z-10 flex-1 text-lg md:text-xl leading-relaxed text-slate-700 font-medium">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      
      <div className="relative z-10 flex items-center gap-4 mt-auto">
        <div className="relative size-14 sm:size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100 bg-slate-50">
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
          <span className="truncate text-[13px] sm:text-sm font-bold uppercase tracking-[0.5px] text-slate-900">
            {testimonial.name}
          </span>
          <span className="line-clamp-2 text-sm leading-relaxed text-slate-500 pr-4">
            {testimonial.role}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
