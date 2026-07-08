import Link from "next/link";
import { ArrowUpRight, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

interface Tier {
  tag: string;
  title: string;
  subtitle: string;
  body: string;
  points: string[];
  footer: string;
  highlight?: boolean;
}

const tiers: Tier[] = [
  {
    tag: "Single Session",
    title: "High-Stakes Decision Session",
    subtitle: "For one decision you need to get right.",
    body: "A focused 90-minute working session built around your most important leadership decision. You walk in with the situation, you walk out with a clear view of the call, the trade-offs, and what to do next. Built for leaders where the cost of getting it wrong is high.",
    points: [
      "The Decision - Cut through complexity and get clear on the real call you're making.",
      "The Shift - Navigate a bigger role, organisational change, or a critical career move.",
      "The Conversation - Prepare for the moments where alignment, positioning, and judgment shape the outcome.",
    ],
    footer: "A focused 90-minute leadership session.",
  },
  {
    tag: "Four Month Engagement",
    title: "Executive Leadership Partnership",
    subtitle: "For sustained development across the role and the chapter.",
    body: "A ten-month coaching partnership for leaders who want sustained development across the full arc of a role, a chapter, or a transformation. Fifteen sessions, full leadership assessment, 360-feedback, stakeholder alignment, and the kind of depth that produces shifts that actually hold.",
    points: [
      "Full leadership assessment and 360-degree feedback",
      "Fifteen coaching sessions across the engagement",
      "Stakeholder alignment conversations",
      "Mid-point and final progress reviews",
    ],
    footer: "10 months. 15 sessions. A 360 & a roadmap.",
    highlight: true,
  },
  {
    tag: "Four Month Engagement",
    title: "Leadership Clarity Engagement",
    subtitle: "For working through a specific challenge or transition.",
    body: "A structured four-month engagement for leaders navigating a defined challenge a transition, a growth phase, a strategy shift, or a hard team situation. Six sessions over four months, with support in between, to move from stuck to clear.",
    points: [
      "Six confidential coaching sessions over four months",
      "A clear picture of the challenge and where you want to land",
      "Real support between sessions, not just inside them",
      "A defined progress review and the plan for what comes next",
    ],
    footer: "Four months. Six coaching sessions.",
  },
];

export function CoachingEngage() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-14 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[140px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] sm:text-5xl">
            <span className="text-brand-blue">Three ways to engage.</span>
            <br />
            <span className="text-brand-ink">Pick the depth that fits.</span>
          </h2>
          <p className="max-w-md text-base leading-7 text-brand-ink/70">
            Leaders engage with me in different ways depending on how much depth they need. All three are confidential,
            one-on-one, and built around your situation - not a curriculum.
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.title}
              className={cn(
                "flex flex-col gap-6 rounded-[28px] border p-8",
                t.highlight
                  ? "border-brand-blue bg-gradient-to-b from-white to-brand-blue/[0.06] ring-1 ring-brand-blue"
                  : "border-brand-blue/10 bg-white",
              )}
            >
              <span className="w-fit rounded-full bg-brand-navy/5 px-3 py-1 text-sm text-brand-navy">{t.tag}</span>
              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-2xl font-semibold leading-tight text-brand-ink">{t.title}</h3>
                <p className="text-base font-medium text-brand-ink">{t.subtitle}</p>
                <p className="text-sm leading-6 text-brand-ink/70">{t.body}</p>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-brand-blue/10 p-5">
                <h4 className="font-heading text-base font-semibold text-[#d27300]">What we work through</h4>
                <ul className="flex flex-col gap-3">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm leading-6 text-brand-ink/80">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#d27300]" strokeWidth={2.5} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <p
                className={cn(
                  "mt-auto flex items-center gap-2 text-sm text-[#5d6b2e]",
                  t.highlight && "font-semibold",
                )}
              >
                <Clock className="size-4 shrink-0" strokeWidth={2} />
                {t.footer}
              </p>

              <Link
                href={BOOK_CALL_HREF}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-brand-navy px-8 text-sm font-semibold uppercase tracking-[0.25px] text-brand-bg transition-opacity hover:opacity-90"
              >
                Book your call <ArrowUpRight className="size-4" strokeWidth={2} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
