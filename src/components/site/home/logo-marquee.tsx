export const LOGOS = [
  { src: "/home/logos/harvard.png", alt: "Harvard Business School", h: "h-[40px] sm:h-[48px] md:h-[52px]" },
  { src: "/home/logos/ucd.png", alt: "University College Dublin", h: "h-[40px] sm:h-[48px] md:h-[52px]" },
  { src: "/home/logos/microsoft-logo-png-2396.png", alt: "Microsoft", h: "h-[32px] sm:h-[36px] md:h-[40px]" },
  { src: "/home/logos/red-hat-seeklogo.png", alt: "Red Hat", h: "h-[32px] sm:h-[36px] md:h-[40px]" },
];

export function LogoMarquee() {
  return (
    <section className="relative z-10 pt-16 md:pt-24 pb-10 sm:pb-16 md:pb-20 bg-slate-50">
      <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-blue-600 text-center mb-6 sm:mb-10 md:mb-14 opacity-0 animate-fade-in-up [animation-delay:500ms]">
        TRUSTED BY LEADERS FROM
      </p>

      {/* Mobile: single-line looping marquee */}
      <div className="sm:hidden overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="flex w-max animate-marquee items-center gap-12 motion-reduce:animate-none">
          {[...LOGOS, ...LOGOS].map((logo, index) => (
            <div key={index} className="shrink-0 flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                className={`w-auto object-contain opacity-50 grayscale ${logo.h}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: static grid */}
      <div className="hidden sm:flex flex-wrap items-center justify-center gap-16 md:gap-20 px-6">
        {LOGOS.map((logo, index) => (
          <div
            key={logo.alt}
            className="flex items-center justify-center opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${600 + index * 100}ms` }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className={`w-auto object-contain animate-logo-spotlight ${logo.h}`}
              style={{ animationDelay: `${index * 3}s` }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
