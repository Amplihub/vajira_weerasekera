import Image from "next/image";

const logos = [
  { src: "/home/logos/microsoft.svg", alt: "Microsoft", w: 160, h: 44 },
  { src: "/home/logos/harvard.png", alt: "Harvard Business School", w: 130, h: 56 },
  { src: "/home/logos/redhat.svg", alt: "Red Hat", w: 205, h: 49 },
  { src: "/home/logos/ucd.png", alt: "University College Dublin", w: 80, h: 30 },
];

export function ExperienceBand() {
  return (
    <section className="border-y border-brand-ink/10 bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col items-center gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:gap-6 lg:py-0 lg:pl-[128px] lg:pr-[70px]">
        <p className="max-w-[260px] shrink-0 text-center font-heading text-xl leading-6 text-brand-ink lg:text-left">
          Experience Includes Leadership Roles and Collaboration With
        </p>
        <div className="grid w-full grid-cols-2 items-center gap-x-8 gap-y-6 lg:flex lg:flex-1 lg:flex-wrap lg:justify-center lg:gap-0 lg:divide-x lg:divide-brand-ink/10">
          {logos.map((l) => (
            <div key={l.alt} className="flex items-center justify-center py-2 lg:flex-1 lg:p-8">
              <Image src={l.src} alt={l.alt} width={l.w} height={l.h} className="h-auto max-h-9 w-auto object-contain sm:max-h-11" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
