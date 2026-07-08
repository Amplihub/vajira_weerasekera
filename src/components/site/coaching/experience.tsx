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
    stat: "400+",
    body: "400+ specialists leading global technology organisations across the US, EMEA, and Asia.",
  },
  {
    stat: "Office 365",
    body: "Launched Office 365 in Asia, founded Microsoft's IoT Centre of Excellence for Asia, and established Red Hat's first AI team in Asia Pacific.",
  },
];

export function CoachingExperience() {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <DecorRings height={900} color="#3D8BF2" rightOnly />

      <div className="relative mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[120px]">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] sm:text-5xl">
            <span className="text-white">Leadership</span>{" "}
            <span className="text-white/50">Experience</span>
          </h2>
          <p className="max-w-md text-base leading-7 text-white/70">
            Leaders engage with me in different ways depending on how much depth
            they need. All three are confidential, one-on-one, and built around
            your situation - not a curriculum.
          </p>
        </div>

        <div className="grid grid-cols-1 rounded-2xl border border-white/10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-5 p-8">
              {s.stat ? (
                <span className="font-heading text-4xl font-medium text-white">
                  {s.stat}
                </span>
              ) : (
                <span className="flex h-9 items-center gap-4">
                  {s.logos?.map((l) => (
                    <Image
                      key={l.alt}
                      src={l.src}
                      alt={l.alt}
                      width={l.w}
                      height={l.h}
                      style={{ width: "auto", height: "auto" }}
                      className="max-h-7 object-contain"
                    />
                  ))}
                </span>
              )}
              <p className="text-sm leading-6 text-white/60">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
