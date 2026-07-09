import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PortfolioItem {
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  href: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    tag: "BOOK",
    title: "Motivating Mavericks",
    description: "Unlocking unconventional talent. A framework for leading high-performers who break the standard mold.",
    imageSrc: "/about/work/motivating-mavericks.png",
    href: "#",
  },
  {
    tag: "BOOK",
    title: "Life of the Run",
    description: "Leadership, community, and endurance. Lessons extracted from the ultra-marathon.",
    imageSrc: "/about/work/life-of-the-run.png",
    href: "#",
  },
  {
    tag: "CRAFT STUDIO",
    title: "Veritas Signature",
    description: "Handcrafted writing instruments from rare timbers. Craftsmanship turned into opportunity for children in need.",
    imageSrc: "/about/work/veritas-signature.png",
    href: "#",
  },
];

export function AboutLeadership() {
  return (
    <section className="relative overflow-hidden bg-white pb-32 pt-24 lg:pb-48 lg:pt-32">
      <div className="relative mx-auto flex max-w-7xl flex-col px-6 sm:px-8 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            The work does not stop at <span className="font-serif italic font-normal text-blue-600">coaching.</span>
          </h2>
          <p className="text-lg text-slate-600 mt-6 max-w-2xl leading-relaxed">
            Books, a craft studio, a foundation for children. Different shapes, same belief: we carry more potential than we&apos;re given room to use.
          </p>
        </div>

        {/* Naked Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mt-16 md:mt-24">
          {portfolioItems.map((item, i) => (
            <div key={i} className="flex flex-col group">
              {/* Image Wrapper */}
              <Link href={item.href} className="aspect-[4/5] relative w-full overflow-hidden rounded-2xl shadow-xl shadow-slate-200/50 cursor-pointer block">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>
              
              {/* Meta Tag */}
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 mt-8 mb-2">
                {item.tag}
              </span>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-slate-600 leading-relaxed text-sm md:text-base flex-grow">
                {item.description}
              </p>
              
              {/* Link */}
              <Link href={item.href} className="inline-flex items-center text-sm font-bold text-blue-600 mt-6 group-hover:translate-x-2 transition-transform duration-300 w-fit">
                Explore <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
