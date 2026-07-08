import { Check } from "lucide-react";

const moments = [
  "Stepping into a bigger role and the job hasn't caught up yet",
  "Carrying decisions you can't talk through with your team",
  "Leading through change while everyone watches you for signal",
  "At a career inflection point and the next call isn't obvious",
];

export function CoachingMoments() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto grid max-w-[1664px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-[128px] lg:py-[120px]">
        <h2 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.5px] sm:text-5xl">
          <span className="text-brand-blue">Most leaders</span>{" "}
          <span className="text-brand-ink">come to me at one of these</span> <span className="text-brand-blue">moments</span>
        </h2>

        <ul className="flex flex-col gap-4">
          {moments.map((m) => (
            <li key={m} className="flex items-center gap-4 rounded-full border border-brand-navy/15 bg-white px-6 py-4">
              <span className="flex shrink-0 items-center rounded-full bg-[#d27300]/5 p-1.5">
                <Check className="size-4 text-[#d27300]" strokeWidth={2.5} />
              </span>
              <span className="text-base text-brand-ink">{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
