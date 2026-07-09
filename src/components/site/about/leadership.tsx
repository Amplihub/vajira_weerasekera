import Image from "next/image";

interface Credential {
  title: string;
  body: string;
}

const credentials: Credential[] = [
  {
    title: "30+ years leading global teams",
    body: "From engineering teams to executive boards, across the US, Europe, and Asia Pacific.",
  },
  {
    title: "Former Microsoft CTO. Red Hat VP.",
    body: "An organisation of 400+ specialists across 14 countries. He built Red Hat's first AI team in Asia Pacific.",
  },
  {
    title: "Harvard Business School executive education",
    body: "General management and leadership, studied alongside senior leaders from around the world.",
  },
  {
    title: "Published author on leadership",
    body: "Motivating Mavericks and Life of the Run, on unconventional talent and human-centred leadership.",
  },
  {
    title: "Neuroscience-based coaching",
    body: "Certified in Neuroencoding, helping leaders change how they think and act in ways that hold.",
  },
  {
    title: "Endurance runner & ultra-marathoner",
    body: "Years on the trail shape how he coaches resilience, pacing, and showing up under pressure — leadership lessons drawn from the long run.",
  },
];

export function AboutLeadership() {
  return (
    <section className="relative overflow-hidden bg-white pb-32 pt-24 lg:pb-48 lg:pt-32">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-32 px-6 sm:px-8 lg:px-8">
        
        {/* Story Section: Asymmetric Editorial Layout */}
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          
          <div className="relative z-10 w-full mx-auto order-2 lg:order-1">
            <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] [mask-image:linear-gradient(to_right,black_60%,transparent_100%)]">
              <Image
                src="/about/leadership-portrait.png"
                alt="Vajira Weerasekara on sofa"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover object-left lg:object-center"
              />
            </div>
          </div>

          <div className="flex flex-col gap-8 relative z-20 order-1 lg:order-2">
            <h2 className="font-sans text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
              Leadership in the AI era, learned the long{" "}
              <span className="font-serif italic font-normal text-blue-600">way.</span>
            </h2>
            <div className="flex flex-col gap-6 text-lg md:text-xl text-slate-600 leading-relaxed">
              <p>
                For more than 30 years, Vajira Weerasekera led high-stakes teams as a Microsoft CTO and Red Hat VP. He learned that the decisions that hold up under pressure come from leaders who built the right environment long before the pressure arrived.
              </p>
            </div>
          </div>
          
        </div>

        {/* Credentials Grid: Naked Typographic Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-20 mt-10">
          {credentials.map((c, i) => (
            <div
              key={c.title}
              className="border-l border-slate-200 pl-6 flex flex-col"
            >
              <span className="text-sm font-bold text-blue-600 mb-4 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-sans text-xl font-bold tracking-tight text-slate-900 mb-3 leading-tight">{c.title}</h3>
              <p className="text-base leading-relaxed text-slate-500">{c.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
