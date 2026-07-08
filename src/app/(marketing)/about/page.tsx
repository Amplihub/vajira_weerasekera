import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { AboutLeadership } from "@/components/site/about/leadership";
import { AboutLinkedinCta } from "@/components/site/about/linkedin-cta";
import { FinalCta } from "@/components/site/home/final-cta";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: "About — Vajira Weerasekera",
  description:
    "30+ years leading global teams across the US, Europe, and Asia Pacific — now coaching senior leaders to build results through clarity, not pressure.",
};

export default function AboutPage() {
  return (
    <>
      <div className="relative">
        {/* Ambient Aurora specific to the About Page */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-[5%] right-[-10%] w-[800px] h-[800px] rounded-full bg-brand-blue/20 blur-[120px] sm:blur-[160px] motion-reduce:animate-none"
            style={{ animation: "float-blob 20s infinite ease-in-out" }}
          />
          <div 
            className="absolute top-[25%] right-[5%] w-[600px] h-[600px] rounded-full bg-[#3d8bf2]/15 blur-[100px] sm:blur-[140px] motion-reduce:animate-none"
            style={{ animation: "float-blob 25s infinite ease-in-out reverse", animationDelay: "-5s" }}
          />
        </div>

        <PageHero
          skySrc={null}
          eyebrow="About Vajira Weerasekera"
          title={
            <>
              <span className="text-brand-blue">A coach who spent 30 years</span> in the chair his clients sit in now.
            </>
          }
          subtext="30+ years leading global teams across the US, Europe, and Asia Pacific."
          ctas={[{ label: "Book your call", href: BOOK_CALL_HREF }]}
          image={{ src: "/home/about-portrait.png", alt: "Vajira Weerasekara" }}
        />
      </div>
      <AboutLeadership />
      <AboutLinkedinCta />
      <FinalCta />
    </>
  );
}
