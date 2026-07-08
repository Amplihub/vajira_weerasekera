import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BOOK_CALL_HREF } from "@/lib/site-nav";
import { PillarModal } from "@/components/site/about/pillar-modal";

interface Pillar {
  icon: string;
  title: string;
  body: string;
  more: string;
}

const pillars: Pillar[] = [
  {
    icon: "/home/icons/clarity.svg",
    title: "Clarity",
    body: "He has sat in enough rooms to know most decisions stall in the noise around them, not in the decision itself. The work is to cut to what's true.",
    more: "In a world saturated with data, opinions, and competing priorities, the most valuable leadership skill is the ability to see clearly. Clarity isn't about having all the answers - it's about knowing which questions matter. Leaders with clarity cut through organizational noise to identify what's essential. They communicate with precision, make decisions with confidence, and create alignment where there was confusion. Clarity begins with self-awareness - understanding your own values, strengths, and blind spots - and extends outward into strategic thinking, team direction, and stakeholder communication. When a leader operates from clarity, their entire organization moves with greater purpose and velocity.",
  },
  {
    icon: "/home/icons/energy.svg",
    title: "Energy",
    body: "Potential is common. What turns it into performance is energy, in the person and across the team. He learned to watch for both.",
    more: "Leadership is fundamentally an energy exchange. The most effective leaders don't just manage their own energy - they amplify the energy of everyone around them. But energy in leadership goes far beyond enthusiasm or charisma. It's about creating the conditions where people feel genuinely alive in their work. Leaders who master energy understand the rhythm of performance - when to push and when to restore, when to challenge and when to support. They build cultures where people bring their full creative capacity, not because they're pressured to, but because they're inspired to. Energy is contagious. A leader who shows up depleted depletes their team. A leader who shows up energized creates a multiplier effect that transforms organizational performance.",
  },
  {
    icon: "/home/icons/trust.svg",
    title: "Trust",
    body: "He saw what it cost when teams went quiet under pressure. Psychological safety is a performance driver, not a soft skill.",
    more: "Trust is the invisible infrastructure of every high-performing team and organization. Without it, communication breaks down, decisions get relitigated, and talent walks out the door. Building trust requires consistency between words and actions, the courage to be vulnerable, and the discipline to follow through. But trust also requires something more nuanced - the ability to create psychological safety where people can disagree, make mistakes, and take risks without fear. Leaders who build deep trust don't just earn loyalty - they unlock the collective intelligence of their teams. People share their real concerns, surface their best ideas, and commit fully to shared decisions. Trust is not built through grand gestures. It's built through hundreds of small moments of integrity, attention, and genuine care.",
  },
  {
    icon: "/home/icons/results.svg",
    title: "Results",
    body: "The results that last are built into the environment, not forced through pressure. That held true across every team he led.",
    more: "Clarity, Energy, and Trust are not ends in themselves - they're the foundation for delivering exceptional, sustainable results. The Human Edge approach to results rejects the false choice between performance and people. When leaders get the human dimensions right, results follow naturally and sustainably. Results in the Human Edge framework means outcomes that matter - not just hitting quarterly targets, but building organizational capability, developing future leaders, and creating lasting value. It means results achieved in a way that strengthens rather than depletes the team. Leaders who master all four pillars don't just deliver results - they build the kind of organizations that consistently deliver results, year after year, regardless of external conditions.",
  },
];

export function AboutHumanEdge() {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      {/* Faint top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.04] to-transparent" />

      <div className="relative mx-auto flex flex-col gap-12 px-6 pt-20 sm:px-8 lg:px-[128px] lg:pt-[140px]">
        {/* Heading + intro */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
          <h2 className="font-heading text-3xl font-semibold leading-[1.12] tracking-[-0.5px] sm:text-[40px]">
            <span className="text-white/60">The Human Edge is</span>{" "}
            <span className="text-white">the part of the job he could never hand off</span>
          </h2>
          <p className="max-w-xl self-center text-base leading-7 text-white/70">
            In a world where AI can analyse and automate almost anything, the leaders who make the difference are the
            ones who strengthen the human side. The Human Edge is built on four of them.
          </p>
        </div>

        {/* 4 pillar cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="flex flex-col gap-6 rounded-2xl bg-white/[0.06] p-7 ring-1 ring-white/10"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-white">
                <Image src={p.icon} alt="" width={28} height={28} className="size-7" />
              </span>
              <div className="flex flex-col gap-4">
                <h3 className="font-heading text-2xl font-semibold text-white">{p.title}</h3>
                <p className="text-sm leading-6 text-white/70">{p.body}</p>
              </div>
              <PillarModal title={p.title} body={p.more} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={BOOK_CALL_HREF}
          className="mx-auto inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/40 px-8 text-sm font-semibold uppercase tracking-[0.25px] text-white transition-colors hover:bg-white/10"
        >
          Book your call <ArrowUpRight className="size-4" strokeWidth={2} />
        </Link>
      </div>

      {/* Bottom stage photo — blends from the navy section into the photo */}
      <div className="relative mt-16 aspect-[1920/900] w-full">
        <Image
          src="/about/stage.png"
          alt="Vajira Weerasekara speaking on stage"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-brand-navy to-transparent" />
      </div>
    </section>
  );
}
