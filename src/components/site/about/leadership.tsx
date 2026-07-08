import Image from "next/image";
import { DecorRings } from "@/components/site/decor-rings";

interface Credential {
  icon: string;
  title: string;
  body: string;
}

const credentials: Credential[] = [
  {
    icon: "/about/icons/years.svg",
    title: "30+ years leading global teams",
    body: "From engineering teams to executive boards, across the US, Europe, and Asia Pacific.",
  },
  {
    icon: "/about/icons/cto.svg",
    title: "Former Microsoft CTO. Red Hat VP.",
    body: "An organisation of 400+ specialists across 14 countries. He built Red Hat's first AI team in Asia Pacific.",
  },
  {
    icon: "/about/icons/harvard.svg",
    title: "Harvard Business School executive education",
    body: "General management and leadership, studied alongside senior leaders from around the world.",
  },
  {
    icon: "/about/icons/author.svg",
    title: "Published author on leadership",
    body: "Motivating Mavericks and Life of the Run, on unconventional talent and human-centred leadership.",
  },
  {
    icon: "/about/icons/neuro.svg",
    title: "Neuroscience-based coaching",
    body: "Certified in Neuroencoding, helping leaders change how they think and act in ways that hold.",
  },
  {
    icon: "/services/icons/run.svg",
    title: "Endurance runner & ultra-marathoner",
    body: "Years on the trail shape how he coaches resilience, pacing, and showing up under pressure — leadership lessons drawn from the long run.",
  },
];

export function AboutLeadership() {
  return (
    <section className="relative overflow-hidden bg-brand-bg">
      <DecorRings height={1608} color="#000103" rightOnly />

      <div className="relative mx-auto flex max-w-[1664px] flex-col gap-20 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[160px]">
        {/* Top: image + intro */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-brand-navy/5">
            <Image
              src="/about/leadership-portrait.png"
              alt="Vajira Weerasekara"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <h2 className="font-heading text-3xl font-semibold leading-[1.12] tracking-[-0.5px] sm:text-5xl">
              <span className="text-brand-blue">Leadership in the AI era,</span>
              <br />
              <span className="text-brand-ink">learned the long way</span>
            </h2>
            <div className="flex flex-col gap-6 text-base leading-7 text-brand-ink/80">
              <p>
                For more than 30 years, Vajira Weerasekera led high-stakes teams as a Microsoft CTO and Red Hat VP. He learned that the decisions that hold up under pressure come from leaders who built the right environment long before the pressure arrived.
              </p>
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="grid gap-y-10 gap-x-12 lg:grid-cols-2 lg:gap-y-14">
          {credentials.map((c) => (
            <div
              key={c.title}
              className="flex items-start gap-6 border-t border-brand-ink/10 pt-6"
            >
              <Image src={c.icon} alt="" width={32} height={32} className="size-8 shrink-0 opacity-70" />
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-xl font-semibold tracking-[-0.2px] text-brand-ink">{c.title}</h3>
                <p className="text-base leading-6 text-brand-ink/70">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
