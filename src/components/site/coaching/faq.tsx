import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Faq {
  q: string;
  a: string;
}

// NOTE: only the first answer was supplied in the design. Answers 2-6 are placeholders — replace with real copy.
const faqs: Faq[] = [
  {
    q: "Is what we talk about actually confidential?",
    a: "Absolutely. Everything discussed in our coaching sessions is completely confidential. I will never share the content of our conversations with your organization, your manager, or HR without your explicit written consent. The only exception would be if there were a genuine risk of harm. I may share general themes or progress summaries with your HR sponsor, but only with your advance agreement on what is shared.",
  },
  {
    q: "How do the sessions actually run?",
    a: "Sessions are one-on-one and run for 60–90 minutes, in person or over video. Each one is built around what you bring that day, with the focus we agreed up front holding the thread across the engagement.",
  },
  {
    q: "Is this right for me?",
    a: "If you are a senior leader carrying real pressure and want honest pushback rather than polite reflection, it is a strong fit. The best way to know is a short call to talk through your situation.",
  },
  {
    q: "How is this different from the coaching I've tried before?",
    a: "This is coaching from someone who has held the roles you are in. It is grounded in three decades of leading global teams, not a generic framework, and it is built around your situation rather than a fixed curriculum.",
  },
  {
    q: "How does payment work?",
    a: "Engagements are invoiced up front or in agreed instalments depending on the format. We confirm scope and terms before any work begins, so there are no surprises.",
  },
  {
    q: "When will I actually see a shift?",
    a: "Most leaders notice clearer thinking within the first few sessions. Deeper, durable shifts in how you lead build over the course of the engagement.",
  },
];

export function CoachingFaq() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto grid max-w-[1664px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:items-start lg:gap-20 lg:px-[128px] lg:py-[120px]">
        <div className="flex flex-col gap-10">
          <h2 className="font-heading text-4xl font-semibold leading-[1.15] tracking-[-0.5px] sm:text-5xl">
            <span className="text-brand-blue">Common questions</span> <span className="text-brand-ink">before leaders engage</span>
          </h2>

          <Accordion defaultValue={["0"]} className="flex flex-col gap-4">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={String(i)}
                className="rounded-2xl border border-brand-blue/10 bg-white px-6 data-[panel-open]:border-brand-blue/40"
              >
                <AccordionTrigger className="font-heading text-base font-semibold text-brand-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-brand-ink/70">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-brand-navy/5">
            <Image
              src="/coaching/portrait.png"
              alt="Vajira Weerasekara"
              fill
              sizes="(max-width:1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
