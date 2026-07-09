"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { CtaButton } from "@/components/site/cta-button";
import { useEffect, useRef } from "react";

export interface PageHeroProps {
  eyebrow?: React.ReactNode;
  /** Heading content — wrap accent words in <span className="text-brand-blue">. */
  title: React.ReactNode;
  subtext?: React.ReactNode;
  ctas?: { label: string; href: string; variant?: "primary" | "outline" }[];
  /** Right-side image. Omit to render a single-column hero. */
  image?: { src: string; alt: string; priority?: boolean; sizes?: string };
  /** Sky / background image behind the hero. Defaults to the home sky. Pass null to disable. */
  skySrc?: string | null;
  /** Whether to enable the staggered entrance animation. */
  animateIn?: boolean;

  // ── className overrides (merged over the defaults via tailwind-merge) ──
  className?: string; // <section>
  containerClassName?: string; // grid container — change column split here
  contentClassName?: string; // left text column
  eyebrowClassName?: string;
  titleClassName?: string;
  subtextClassName?: string;
  ctasClassName?: string;
  skyClassName?: string;
  overlayClassName?: string;
  imageWrapClassName?: string; // image position / aspect / max-width
  imageClassName?: string; // object-fit / object-position
}

// Shared marketing hero. Defaults reproduce the Home hero 1:1; every part takes a
// className override so other pages can swap content + tweak image size/position.
export function PageHero({
  eyebrow,
  title,
  subtext,
  ctas,
  image,
  skySrc = "/home/hero-sky.png",
  animateIn = false,
  className,
  containerClassName,
  contentClassName,
  eyebrowClassName,
  titleClassName,
  subtextClassName,
  ctasClassName,
  skyClassName,
  overlayClassName,
  imageWrapClassName,
  imageClassName,
}: PageHeroProps) {
  const animClass = animateIn ? "opacity-0 animate-fade-in-up motion-reduce:animate-none motion-reduce:opacity-100" : "";
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animateIn || !parallaxRef.current) return;
    
    // Respect prefers-reduced-motion and small screens for parallax
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;
    // Disable parallax on mobile — too janky on low-powered devices
    if (window.innerWidth < 768) return;

    const onScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      // Max offset of 15px, moving slightly slower than scroll
      const offset = Math.min(scrollY * 0.05, 15);
      parallaxRef.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [animateIn]);

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {skySrc && (
        <>
          <Image
            src={skySrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className={cn("object-cover object-top", skyClassName)}
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b from-transparent via-brand-bg/40 to-brand-bg",
              overlayClassName,
            )}
          />
        </>
      )}

      <div
        className={cn(
          "relative mx-auto grid max-w-[1664px] items-center gap-8 lg:gap-12 px-6 sm:px-8 pt-24 lg:pt-30",
          image ? "lg:grid-cols-[1fr_minmax(0,860px)]" : "",
          containerClassName,
        )}
      >
        {/* Text */}
        <div
          className={cn("flex flex-col items-start gap-6 lg:gap-10 relative z-10 lg:py-12", contentClassName)}
        >
          <div className="flex flex-col gap-4 lg:gap-5">
            {eyebrow && (
              <span
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-brand-ink/80",
                  animClass,
                  eyebrowClassName,
                )}
              >
                <span className="size-1.5 shrink-0 rounded-full bg-brand-blue" />
                {eyebrow}
              </span>
            )}
            <div className="flex flex-col gap-6">
              <h1
                className={cn(
                  "font-heading text-4xl leading-[1.1] sm:text-[2.5rem] lg:text-[60px] font-semibold lg:leading-none tracking-[-1px] lg:tracking-[-1.5px] text-brand-ink",
                  // No animClass here since the title itself handles the word stagger
                  titleClassName,
                )}
              >
                {title}
              </h1>
              {subtext && (
                <p
                  className={cn(
                    "max-w-2xl text-[15px] sm:text-base leading-relaxed lg:leading-7 text-brand-ink/70",
                    animClass,
                    "[animation-delay:200ms]",
                    subtextClassName,
                  )}
                >
                  {subtext}
                </p>
              )}
            </div>
          </div>
          {ctas && ctas.length > 0 && (
            <div
              className={cn(
                "flex flex-row flex-wrap items-center gap-3 mt-2",
                animateIn ? "hero-cta-group opacity-0 animate-fade-in-up [animation-delay:300ms] motion-reduce:animate-none motion-reduce:opacity-100" : "",
                ctasClassName
              )}
            >
              {ctas.map((c) => (
                <CtaButton
                  key={c.href + c.label}
                  href={c.href}
                  variant={c.variant}
                >
                  {c.label}
                </CtaButton>
              ))}
            </div>
          )}
        </div>

        {/* Portrait — hidden on mobile to avoid cramped circle, visible sm+ */}
        {image && (
          <div className="hidden sm:block">
            <div
              ref={parallaxRef}
              className={cn(
                "relative mx-auto aspect-square w-full sm:max-w-[380px] lg:max-w-[690px]",
                animateIn ? "opacity-0 animate-fade-in-scale [animation-delay:150ms] motion-reduce:animate-none motion-reduce:opacity-100" : "",
                imageWrapClassName,
              )}
            >
              {/* Decorative Rings */}
              <div className="absolute -inset-6 -z-10 rounded-full border border-blue-500/15" aria-hidden="true" />
              <div className="absolute -inset-14 -z-10 rounded-full border border-blue-500/10" aria-hidden="true" />

              {/* Ambient Aurora Background */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none mix-blend-multiply opacity-60 dark:mix-blend-screen dark:opacity-20">
                <div 
                  className="absolute w-[70%] h-[70%] rounded-full bg-brand-blue blur-[80px] sm:blur-[120px] motion-reduce:animate-none"
                  style={{ animation: "float-blob 20s infinite ease-in-out" }}
                />
                <div 
                  className="absolute w-[60%] h-[60%] rounded-full bg-brand-blue/70 blur-[100px] sm:blur-[140px] motion-reduce:animate-none"
                  style={{ animation: "float-blob 25s infinite ease-in-out reverse", animationDelay: "-5s" }}
                />
              </div>
              
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl bg-transparent">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={image.priority ?? true}
                  sizes={image.sizes ?? "(max-width: 1024px) 100vw, 815px"}
                  className={cn("object-cover object-[center_top]", imageClassName)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
