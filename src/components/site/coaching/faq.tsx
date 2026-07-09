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
    <section className="bg-transparent py-20 md:py-32">
      <div className="mx-auto grid max-w-[1664px] gap-16 px-6 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-24 lg:px-[128px]">
        <div className="flex flex-col gap-12 max-w-2xl">
          <h2 className="font-sans text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl text-slate-900 mb-4">
            Common questions before leaders <span className="font-serif italic font-normal text-blue-600">engage</span>
          </h2>

          <Accordion defaultValue={["0"]} className="flex flex-col w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={String(i)}
                className="border-b border-slate-200 py-2"
              >
                <AccordionTrigger className="font-sans text-lg font-bold text-slate-900 hover:no-underline text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-lg text-slate-600 leading-relaxed pr-8 pt-2 pb-6">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="lg:sticky lg:top-32 hidden lg:block">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/coaching/portrait.png"
              alt="Vajira Weerasekara"
              fill
              sizes="(max-width:1024px) 100vw, 45vw"
              className="object-cover [mask-image:linear-gradient(to_left,black_60%,transparent_100%)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
