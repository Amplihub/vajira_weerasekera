import Image from "next/image";
import { DecorRings } from "@/components/site/decor-rings";

interface Stat {
  stat?: string;
  logos?: { src: string; alt: string; w: number; h: number }[];
  body: string;
}

const stats: Stat[] = [
  {
    stat: "30+ Years",
    body: "Leading global technology organisations across the US, EMEA, and Asia.",
  },
  {
    logos: [
      {
        src: "/home/logos/microsoft-white.svg",
        alt: "Microsoft",
        w: 130,
        h: 28,
      },
      { src: "/home/logos/redhat-white.svg", alt: "Red Hat", w: 110, h: 30 },
    ],
    body: "Former Microsoft CTO Asia and VP, Office of Technology APAC at Red Hat.",
  },
  {
    stat: "Office 365",
    body: "Launched Office 365 in Asia, founded Microsoft's IoT Centre of Excellence for Asia, and established Red Hat's first AI team in Asia Pacific.",
  },
];

export function CoachingExperience() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <DecorRings height={900} color="#3D8BF2" rightOnly />

      <div className="relative mx-auto flex max-w-[1664px] flex-col gap-24 px-6 sm:px-8 lg:px-[128px] py-24 md:py-32">
        <div className="flex flex-col gap-6">
          <h2 className="font-sans text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            <span className="text-white">Leadership Experience</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 lg:gap-16">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col">
              {s.stat ? (
                <span className="font-sans text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                  {s.stat}
                </span>
              ) : (
                <span className="flex h-[4.5rem] md:h-[6rem] items-center gap-6">
                  {s.logos?.map((l) => (
                    <Image
                      key={l.alt}
                      src={l.src}
                      alt={l.alt}
                      width={l.w}
                      height={l.h}
                      style={{ width: "auto", height: "auto" }}
                      className="max-h-8 md:max-h-12 object-contain"
                    />
                  ))}
                </span>
              )}
              <p className="mt-6 text-xs tracking-[0.2em] uppercase leading-relaxed text-slate-400 font-semibold">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
