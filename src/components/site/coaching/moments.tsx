import { Check } from "lucide-react";

const moments = [
  "Stepping into a bigger role and the job hasn't caught up yet",
  "Carrying decisions you can't talk through with your team",
  "Leading through change while everyone watches you for signal",
  "At a career inflection point and the next call isn't obvious",
];

export function CoachingMoments() {
  return (
    <section className="bg-transparent py-20 md:py-32">
      <div className="mx-auto grid max-w-[1664px] gap-16 px-6 sm:px-8 lg:grid-cols-[1fr_1.5fr] lg:gap-24 lg:px-[128px]">
        {/* Left Col: Sticky Headline */}
        <div className="lg:sticky lg:top-32 lg:h-fit mb-12 lg:mb-0">
          <h2 className="font-sans text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl text-slate-900">
            Most leaders come to me at one of these <span className="font-serif italic font-normal text-blue-600">moments</span>
          </h2>
        </div>

        {/* Right Col: Naked List */}
        <ul className="flex flex-col space-y-6">
          {moments.map((m) => (
            <li key={m} className="flex items-start border-l-2 border-blue-200 hover:border-blue-600 transition-colors pl-6 py-2">
              <span className="text-lg text-slate-600 leading-relaxed">{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
