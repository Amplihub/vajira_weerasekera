import Image from "next/image";
import { CtaButton } from "@/components/site/cta-button";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

interface Pillar {
  icon: string;
  title: string;
  body: string;
}

const pillars: Pillar[] = [
  {
    icon: "/home/icons/clarity.svg",
    title: "Clarity",
    body: "Most decisions stall in noise. Vajira helps leaders cut to what's true and think clearly under pressure.",
  },
  {
    icon: "/home/icons/energy.svg",
    title: "Energy",
    body: "Potential doesn't turn into performance on its own. It needs the energy, in the person and the team, to get there.",
  },
  {
    icon: "/home/icons/trust.svg",
    title: "Trust",
    body: "Psychological safety is a performance driver, not a soft skill. It's what lets people speak openly and act with conviction.",
  },
  {
    icon: "/home/icons/results.svg",
    title: "Results",
    body: "Results come from the environment, not the pressure. The kind that hold up over time, for the leader, the team, and the business.",
  },
];

export function HumanEdge() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto grid max-w-[1664px] gap-16 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:px-[128px] lg:py-[160px]">
        {/* Left: framing */}
        <div className="flex flex-col gap-10 lg:sticky lg:top-32 lg:self-start">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold text-brand-navy">
              The Human Edge. Leadership in the AI era
            </p>
            <h2 className="font-heading text-3xl font-semibold leading-tight tracking-[-1px] text-brand-ink sm:text-5xl">
              <span className="text-brand-blue">The Human Edge: </span> the part
              of leadership AI can&apos;t do for you.
            </h2>
            <p className="max-w-xl text-base leading-7 text-brand-ink/70">
              AI can analyse and automate almost anything. It still cannot lead.
              In the AI era, the leaders who make the difference are the ones
              who strengthen the human side of the job: judgement, trust, and
              the conditions where people perform at their best. The Human Edge
              is the framework Vajira built around the four pillars that hold
              those together.
            </p>
          </div>
          <CtaButton href={BOOK_CALL_HREF}>Book your discovery call</CtaButton>
        </div>

        {/* Right: four pillars */}
        <div className="flex flex-col gap-6">
          {pillars.map(({ icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-sm"
            >
              <Image
                src={icon}
                alt=""
                width={48}
                height={48}
                className="size-12"
              />
              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-2xl font-semibold text-brand-ink">
                  {title}
                </h3>
                <p className="text-base leading-6 text-brand-ink/70">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
