import { PageHero } from "@/components/site/page-hero";

export function HomeHero() {
  return (
    <PageHero
      skySrc={null}
      animateIn={true}
      className="bg-[#eef2fb]"
      eyebrow="Executive Coaching for Senior Leaders"
      title={
        <span className="flex flex-col">
          <span className="opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none [animation-delay:100ms]">
            <span className="text-brand-blue">Coaching for leaders</span>
          </span>
          <span className="opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none [animation-delay:220ms]">
            who need to think
          </span>
          <span className="opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none [animation-delay:340ms]">
            clearly under pressure.
          </span>
        </span>
      }
      subtext="Executive coaching grounded in 30+ years of leading global teams at Microsoft and Red Hat."
      ctas={[
        { label: "Book your call", href: "#book-a-call" },
        {
          label: "See how coaching works",
          href: "/executive-coaching",
          variant: "outline",
        },
      ]}
      image={{
        src: "/brand/vajira-avatar-zoomed.png",
        alt: "Vajira Weerasekara",
        sizes: "690px",
      }}
      containerClassName="lg:grid-cols-[1fr_minmax(0,690px)]"
      // containerClassName="pt-0!"
    />
  );
}

