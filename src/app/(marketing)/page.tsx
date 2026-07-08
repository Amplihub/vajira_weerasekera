import { HomeHero } from "@/components/site/home/hero";
import { ExperienceBand } from "@/components/site/home/experience-band";
import { WaysToWork } from "@/components/site/home/ways-to-work";
import { ServicesSummary } from "@/components/site/home/services-summary";
import { Testimonials } from "@/components/site/home/testimonials";
import { FinalCta } from "@/components/site/home/final-cta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ExperienceBand />
      <WaysToWork />
      <ServicesSummary />
      <Testimonials />
      <FinalCta />
    </>
  );
}

