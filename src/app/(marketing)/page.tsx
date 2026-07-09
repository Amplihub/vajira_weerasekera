import { HomeHero } from "@/components/site/home/hero";
import { WaysToWork } from "@/components/site/home/ways-to-work";
import { Testimonials } from "@/components/site/home/testimonials";
import { FinalCta } from "@/components/site/home/final-cta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <WaysToWork />
      <Testimonials />
      <FinalCta />
    </>
  );
}

