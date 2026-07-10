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
    tag: "AUTHOR",
    title: "Motivating Mavericks",
    description: "Motivating Mavericks: The Secret to High-Performing Teams",
    imageSrc: "/about/work/motivating-mavericks.png",
    href: "#",
  },
  {
    tag: "COMMUNITY",
    title: "Life of the Run",
    description: "Ultra-marathon running as a leadership and community project",
    imageSrc: "/about/work/life-of-the-run.png",
    href: "#",
  },
  {
    tag: "CRAFT STUDIO",
    title: "Veritas Signature",
    description: "Handcrafted writing instrument studio; proceeds support Let Kids Fly",
    imageSrc: "/about/work/veritas-signature.png",
    href: "#",
  },
  {
    tag: "FOUNDATION",
    title: "Let Kids Fly",
    description: "Let Kids Fly: Co-founded with wife Kali scholarships and education support for underprivileged children",
    imageSrc: "/about/work/let-kids-fly.png",
    href: "#",
  }
];

export function AboutLeadership() {
  // Duplicate array for infinite scroll
  const carouselItems = [...portfolioItems, ...portfolioItems];

  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-16 lg:pb-24 lg:pt-20">
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
      </div>

      {/* Infinite Auto-Loop Carousel */}
      <div className="mt-10 md:mt-12 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-4 md:gap-6 w-max animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] focus-within:[animation-play-state:paused] py-4">
          {carouselItems.map((item, i) => (
            <div key={i} className="flex-none w-[80vw] sm:w-[280px] md:w-[300px] lg:w-[340px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              {/* Image Wrapper */}
              <Link href={item.href} className="relative w-full h-40 sm:h-48 md:h-56 bg-slate-100 cursor-pointer block">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 280px, (max-width: 1024px) 300px, 340px"
                />
              </Link>
              
              {/* Text Area */}
              <div className="p-4 md:p-5 flex flex-col flex-grow">
                {/* Meta Tag */}
                <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
                  {item.tag}
                </span>
                
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-slate-600 leading-relaxed text-sm flex-grow">
                  {item.description}
                </p>
                
                {/* Link */}
                <Link href={item.href} className="inline-flex items-center text-sm font-bold text-blue-600 mt-4 group-hover:translate-x-1 transition-transform duration-300 w-fit">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
