import { HomeHero } from "@/components/site/home/hero";
import { Ticker } from "@/components/site/home/ticker";
import { LogoMarquee } from "@/components/site/home/logo-marquee";
import { WaysToWork } from "@/components/site/home/ways-to-work";
import { Testimonials } from "@/components/site/home/testimonials";
import { FinalCta } from "@/components/site/home/final-cta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Ticker />
      <LogoMarquee />
      <WaysToWork />
      <Testimonials />
      <FinalCta />
    </>
  );
}

