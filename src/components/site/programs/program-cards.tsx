import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Program {
  available: boolean;
  image?: string;
  title: string;
  body: string;
  learnMore?: string;
}

const programs: Program[] = [
  {
    available: true,
    image: "/home/emerging-image.png",
    title: "Emerging Leaders Program",
    body: "An intensive development program for high-potential managers making the critical transition from operational management to strategic leadership. Built on the Human Edge framework.",
    learnMore: "/emerging-leaders",
  },
  {
    available: false,
    title: "Manager Coaching Series",
    body: "A structured group coaching program for mid-level managers seeking to strengthen their leadership fundamentals - communication, delegation, feedback, and team development.",
  },
  {
    available: false,
    title: "Executive Offsites",
    body: "Bespoke facilitated offsites for leadership teams looking to align on strategy, reset team dynamics, or navigate a major transition. Designed and delivered to your specific context.",
  },
];

export function ProgramCards() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto grid max-w-[1664px] gap-8 px-6 py-20 sm:px-8 lg:grid-cols-3 lg:px-[128px] lg:py-[120px]">
        {programs.map((p) => (
          <article key={p.title} className="flex flex-col gap-6 rounded-3xl border border-brand-blue/10 bg-white p-3">
            {/* Visual */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              {p.available && p.image ? (
                <Image src={p.image} alt={p.title} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-gradient-to-b from-brand-blue/5 to-brand-blue/10 text-6xl">
                  🔒
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
              <span
                className={
                  p.available
                    ? "w-fit text-sm font-medium text-[#d27300]"
                    : "w-fit rounded-md bg-brand-ink/5 px-2.5 py-1 text-sm text-brand-ink/60"
                }
              >
                {p.available ? "Available" : "Coming Soon"}
              </span>
              <h3 className="font-heading text-2xl font-semibold text-brand-ink">{p.title}</h3>
              <p className="text-sm leading-6 text-brand-ink/70">{p.body}</p>

              {p.available && (
                <div className="mt-auto flex flex-col gap-2 pt-4">
                  <Link
                    href={p.learnMore ?? "#"}
                    className="flex h-12 items-center justify-center gap-1 rounded-full bg-brand-navy/5 px-5 text-xs font-semibold uppercase tracking-[0.25px] text-brand-navy transition-colors hover:bg-brand-navy/10"
                  >
                    Learn more <ArrowUpRight className="size-4" strokeWidth={2} />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex h-12 items-center justify-center gap-1 rounded-full bg-brand-navy px-5 text-xs font-semibold uppercase tracking-[0.25px] text-brand-bg transition-opacity hover:opacity-90"
                  >
                    Book a free call <ArrowUpRight className="size-4" strokeWidth={2} />
                  </Link>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
