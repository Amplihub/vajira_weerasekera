import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function ServicesSummary() {
  return (
    <section className="relative overflow-hidden bg-slate-50 border-y border-gray-200 py-24 md:py-32">
      {/* 3D Asset Background (Atmospheric Crop) */}
      <Image
        src="/home/Square.png"
        alt="3D Wireframe Background"
        width={800}
        height={800}
        className="absolute right-0 top-[55%] -translate-y-[35%] w-[800px] max-w-none opacity-90 pointer-events-none z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1664px] px-6 sm:px-8 lg:px-[128px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          {/* Left Side: High-Impact Typography */}
          <div className="md:col-span-7 lg:col-span-7">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              <span className="text-slate-900 block">One framework.</span>
              <span className="text-brand-blue block">Every format.</span>
            </h2>
          </div>

          {/* Right Side: Refined Supporting Copy & CTA */}
          <div className="relative z-10 md:col-span-5 lg:col-span-4 lg:col-start-9 flex flex-col gap-8 md:pt-4">
            <p className="text-lg text-slate-500 leading-relaxed">
              Same framework, every time: clarity, energy, trust, results.
              Whether it&apos;s one conversation or a full program.
            </p>
            <Link
              href="/speaking"
              className="group inline-flex items-center gap-2 text-brand-blue font-semibold w-fit transition-colors hover:text-blue-700"
            >
              See speaking topics
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
