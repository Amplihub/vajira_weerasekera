import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LINKEDIN_URL } from "@/lib/site-nav";

export function AboutLinkedinCta() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dark Premium Breakout Container */}
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 grid grid-cols-1 md:grid-cols-2 items-stretch">
          
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Left: Copy & CTA */}
          <div className="relative z-20 flex flex-col items-start justify-center gap-8 p-8 sm:p-12 md:py-24 md:pl-16 lg:py-32 lg:pl-20">
            <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              The thinking behind the coaching. He posts it on{" "}
              <span className="font-serif italic font-normal text-blue-500">LinkedIn.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-lg">
              Short posts on leadership, psychological safety, and performance under pressure. The same thinking that shapes his coaching, written the way he talks.
            </p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
            >
              Read his LinkedIn posts
              <ArrowUpRight className="size-5 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={2.5} />
            </a>
          </div>

          {/* Right: Integrated Portrait */}
          <div className="relative z-10 hidden md:block w-full h-full min-h-[400px] [mask-image:linear-gradient(to_right,transparent_0%,black_30%,black_100%)]">
            <Image
              src="/home/ways/Vajira_ways_to_work.png"
              alt="Vajira Weerasekara"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}
