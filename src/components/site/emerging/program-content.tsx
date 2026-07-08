import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// NOTE: only Module 1's detail was supplied. Modules 2-7 bodies are placeholders — replace with real copy.
const modules = [
  {
    title: "Module 1: The Leadership Mindset Shift",
    body: "Understanding the fundamental difference between managing and leading. Assessing your current leadership style and identifying growth edges. Building self-awareness through 360-degree feedback and personal reflection. Setting your leadership development intentions for the program.",
  },
  {
    title: "Module 2: Leading with Clarity",
    body: "Cutting through organisational noise to set direction. Communicating with precision so your team knows what matters and why. Making and owning decisions when the data is incomplete.",
  },
  {
    title: "Module 3: Building Psychological Safety and Energizing Teams",
    body: "Creating the conditions where people speak openly and take smart risks. Reading and lifting the energy of a team, and spotting the drains before they cost you.",
  },
  {
    title: "Module 4: Influence Without Authority",
    body: "Moving decisions and people through trust, credibility, and clarity rather than position. Navigating stakeholders and organisational politics without losing integrity.",
  },
  {
    title: "Module 5: Resilience and Sustainable Performance",
    body: "Leading under sustained pressure without burning yourself or your team out. Building habits and boundaries that keep performance high over the long run.",
  },
  {
    title: "Integration: Leading at the Human-AI Edge",
    body: "Bringing the framework together to lead teams made up of both people and AI. Knowing what only human judgment can do, and building it deliberately.",
  },
  {
    title: "Certification: Certificate of Completion & Applied Leadership Practice",
    body: "A certificate awarded on demonstrated application in real leadership contexts, plus a practical 90-day leadership plan you leave the program with.",
  },
];

export function EmergingProgramContent() {
  return (
    <section id="modules" className="scroll-mt-28 bg-[#f1f5fb]">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-10 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[100px]">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-ink sm:text-5xl">
            Program content
          </h2>
          <p className="text-base leading-7 text-brand-ink/80">
            <span className="font-semibold">Six modules over 12 weeks.</span> Each one applied to your real role
            between sessions.
          </p>
        </div>

        <Accordion defaultValue={["0"]} className="flex flex-col gap-4">
          {modules.map((m, i) => (
            <AccordionItem
              key={m.title}
              value={String(i)}
              className="rounded-2xl border border-brand-blue/10 bg-white px-6"
            >
              <AccordionTrigger className="font-heading text-base font-semibold text-brand-ink hover:no-underline">
                {m.title}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-brand-ink/70">{m.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
