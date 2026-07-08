import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

interface Keynote {
  image: string;
  title: string;
  body: string;
  gains: string[];
}

const keynotes: Keynote[] = [
  {
    image: "/speaking/keynotes/human-edge.png",
    title: "The Human Edge of Leadership in the Age of AI",
    body: "This keynote shows your audience exactly what doesn't get automated, and how to lead teams made up of both people and AI agents without losing the things that actually drive performance.",
    gains: [
      "Spot the leadership capabilities AI can't replicate",
      "Build a practical framework for leading human-AI teams",
      "Lead your people through AI change without losing trust",
    ],
  },
  {
    image: "/speaking/keynotes/mavericks.png",
    title: "Motivating Mavericks: Leading Unconventional Talent",
    body: "The best ideas often come from people who don't fit the standard mould. Based on Vajira's book Motivating Mavericks, this keynote shows your audience how to attract these people, keep them, and channel their creative tension into real competitive advantage - without losing the rest of the team in the process.",
    gains: [
      "Spot and nurture maverick talent inside your organisation",
      "Build environments where independent thinkers do their best work",
      "Turn creative tension into competitive advantage",
    ],
  },
  {
    image: "/speaking/keynotes/energy.png",
    title: "Energy, Not Just Engagement: The Leadership Multiplier",
    body: "Engagement scores keep climbing. Output doesn't always follow. This keynote unpacks why traditional engagement models miss the point, and shows your audience how to build the kind of organisational energy that turns good teams into exceptional ones.",
    gains: [
      "Tell the difference between engagement and real energy",
      "Spot the energy drains in your own leadership",
      "Apply practical habits that build team energy back up",
    ],
  },
  {
    image: "/speaking/keynotes/clarity.png",
    title: "From Complexity to Clarity: Decision-Making Under Pressure",
    body: "Senior leaders rarely get to decide with full data, full alignment, or full time. This keynote gives your audience a practical framework for making sharper calls when all three are missing - and a way to carry the room with them once the call is made.",
    gains: [
      "Apply a structured approach to ambiguous decisions",
      "Build decision-making confidence across your leadership team",
      "Move through organisational politics without losing integrity",
    ],
  },
];

export function SpeakingKeynotes() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-14 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[140px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] sm:text-5xl">
            <span className="text-brand-blue">keynotes built around</span>{" "}
            <span className="text-brand-ink">the calls your audience is making right now</span>
          </h2>
          <p className="max-w-xl text-base leading-7 text-brand-ink/70">
            Each one shaped around a problem real leaders are dealing with today. Customised to your audience, your
            industry, and the conversation you want them leaving with.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {keynotes.map((k) => (
            <article key={k.title} className="flex flex-col gap-6 rounded-3xl border border-brand-blue/10 bg-white p-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-brand-navy/5">
                <Image src={k.image} alt={k.title} fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-6 px-5 pb-5">
                <div className="flex flex-col gap-3">
                  <h3 className="font-heading text-2xl font-semibold text-brand-ink">{k.title}</h3>
                  <p className="text-sm leading-6 text-brand-ink/70">{k.body}</p>
                </div>

                <Accordion multiple={false} className="rounded-2xl border border-[#d27300]/20 bg-[#d27300]/[0.03]">
                  <AccordionItem value="gains" className="border-0 px-5">
                    <AccordionTrigger className="font-heading text-base font-semibold text-[#d27300] hover:no-underline">
                      What audience will gain
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col gap-3 pb-2">
                        {k.gains.map((g) => (
                          <li key={g} className="flex items-start gap-3 text-sm text-brand-ink/80">
                            <Check className="mt-0.5 size-4 shrink-0 text-[#d27300]" strokeWidth={2.5} />
                            {g}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Link
                  href={BOOK_CALL_HREF}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25px] text-brand-navy transition-opacity hover:opacity-80"
                >
                  Book your call <ArrowRight className="size-4" strokeWidth={2} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
