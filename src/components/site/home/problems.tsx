import Image from "next/image";
import { DecorRings } from "@/components/site/decor-rings";

interface ProblemCard {
  icon: string;
  title: string;
  body: string;
  span: string;
}

const cards: ProblemCard[] = [
  {
    icon: "/home/icons/clarity.svg",
    title: "The unspoken AI mandate",
    body: "Teams are told to use AI. Nobody has agreed what better work should actually look like.",
    span: "lg:col-span-2",
  },
  {
    icon: "/home/icons/energy.svg",
    title: "The quiet room",
    body: "People stop saying what they see. By the time the truth reaches leadership, the cost has already grown.",
    span: "lg:col-span-1 lg:col-start-3",
  },
  {
    icon: "/home/icons/trust.svg",
    title: "The decision that won't wait",
    body: "The data is never complete. And waiting too long becomes its own decision.",
    span: "lg:col-span-1 lg:col-start-1",
  },
  {
    icon: "/home/icons/results.svg",
    title: "The plan everyone nodded to",
    body: "The plan is not missing. The shared belief behind the plan is.",
    span: "lg:col-span-2 lg:col-start-2",
  },
];

export function HomeProblems() {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      <DecorRings />

      <div className="relative mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-20 sm:px-8 lg:px-[236px] lg:py-[200px]">
        <h2 className="max-w-3xl font-heading text-3xl font-semibold leading-tight tracking-[-0.5px] text-brand-bg sm:text-[48px]">
          <span className="text-brand-bg/70">The problems </span> that
          don&apos;t show up in the numbers
        </h2>

        <div className="grid gap-4 rounded-3xl border border-white/10 bg-brand-blue/5 p-2 lg:grid-cols-3">
          {cards.map(({ icon, title, body, span }) => (
            <div
              key={title}
              className={`flex flex-col gap-8 rounded-2xl bg-brand-bg p-8 ${span}`}
            >
              <Image
                src={icon}
                alt=""
                width={48}
                height={48}
                className="size-12"
              />
              <div className="flex flex-col gap-6">
                <h3 className="font-heading text-2xl font-semibold capitalize leading-[30px] tracking-[-0.1px] text-brand-ink">
                  {title}
                </h3>
                <p className="text-base leading-6 text-brand-ink/90">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
