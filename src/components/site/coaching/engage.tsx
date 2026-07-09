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
    <section className="bg-transparent py-20 md:py-32 border-t border-slate-200/50">
      <div className="mx-auto flex max-w-[1664px] flex-col px-6 sm:px-8 lg:px-[128px]">
        <div className="flex flex-col gap-6 text-left max-w-2xl mb-16">
          <h2 className="font-sans text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl text-slate-900">
            Three ways to engage.<br/>
            Pick the depth that fits.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Leaders engage with me in different ways depending on how much depth they need. All three are confidential,
            one-on-one, and built around your situation — not a curriculum.
          </p>
        </div>

        <div className="grid gap-16 md:grid-cols-3 md:gap-0">
          {tiers.map((t, i) => (
            <div
              key={t.title}
              className={cn(
                "flex flex-col h-full",
                i === 0 && "md:pr-8 lg:pr-12",
                i === 1 && "md:border-l md:border-slate-200 md:px-8 lg:px-12",
                i === 2 && "md:border-l md:border-slate-200 md:pl-8 lg:pl-12"
              )}
            >
              <div className="flex flex-col items-start gap-8 flex-grow mb-10">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{t.tag}</span>
                
                <div className="flex flex-col gap-4">
                  <h3 className="font-sans text-2xl font-extrabold leading-tight text-slate-900">{t.title}</h3>
                  <p className="text-[15px] font-bold text-slate-900">{t.subtitle}</p>
                  <p className="text-[15px] leading-relaxed text-slate-600 font-light">{t.body}</p>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500">What we work through</h4>
                  <ul className="flex flex-col gap-4">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-600 font-light">
                        <span className="mt-2.5 size-1 shrink-0 rounded-full bg-blue-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-6">
                <p className={cn("flex items-center gap-2 text-sm text-slate-500", t.highlight && "font-medium text-slate-900")}>
                  <Clock className="size-4 shrink-0" strokeWidth={1.5} />
                  {t.footer}
                </p>

                <Link
                  href={BOOK_CALL_HREF}
                  className="bg-slate-900 text-white rounded-full px-8 py-4 text-sm font-bold tracking-[0.1em] uppercase hover:bg-blue-600 transition-all duration-300 w-fit"
                >
                  Book your call
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
