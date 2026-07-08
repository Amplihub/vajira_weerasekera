import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

const stages = [
  {
    image: "/speaking/stages/red-hat.png",
    tag: "keynote Presentation",
    title: "Asia Red Hat Summit – keynote on AI & Portfolio (2024)",
  },
  {
    image: "/speaking/stages/asian-leadership.png",
    tag: "Leadership Conferences",
    title: "Asian Leadership Project – keynote on The Human Edge in the Era of AI (2025)",
  },
  {
    image: "/speaking/stages/ey-partner.png",
    tag: "Executive Forums",
    title: "EY Partner Event – Leadership Panel Discussion (2021)",
  },
];

export function SpeakingRecentStages() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[100px]">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] text-brand-ink sm:text-5xl">
            Recent stages
          </h2>
          <p className="text-base leading-7 text-brand-ink/70">
            A few of the rooms Vajira has spoken in over the last few years.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((s) => (
            <article key={s.title} className="flex flex-col gap-5 rounded-3xl border border-brand-blue/10 bg-white p-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-brand-navy/5">
                <Image src={s.image} alt={s.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-3 px-4 pb-4">
                <span className="text-sm font-medium text-[#d27300]">{s.tag}</span>
                <h3 className="font-heading text-xl font-semibold leading-snug text-brand-ink">{s.title}</h3>
              </div>
            </article>
          ))}
        </div>

        <Link
          href={BOOK_CALL_HREF}
          className="inline-flex h-14 w-fit items-center justify-center gap-2 rounded-full bg-brand-navy px-8 text-sm font-semibold uppercase tracking-[0.25px] text-brand-bg transition-opacity hover:opacity-90"
        >
          Book your call <ArrowUpRight className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
