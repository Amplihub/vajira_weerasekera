import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ProgramCards } from "@/components/site/programs/program-cards";
import { ProgramsCustom } from "@/components/site/programs/custom-program";
import { FinalCta } from "@/components/site/home/final-cta";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: "Leadership Programs — Vajira Weerasekera",
  description:
    "Structured leadership development programs that move senior leaders from doing to leading, with the judgment and presence the next role expects.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="All Programs"
        title={
          <>
            Our <span className="text-brand-blue">Leadership Development</span>{" "}
            Programs
          </>
        }
        subtext="Twelve weeks from now, you've moved out of the doing and into leading, with the judgment and presence the next role expects you to have."
        ctas={[
          { label: "View available programs", href: "#programs" },
          { label: "Book your call", href: BOOK_CALL_HREF, variant: "outline" },
        ]}
        image={{
          src: "/home/programs-portrait.png",
          alt: "Vajira Weerasekara",
          sizes: "690px",
        }}
        containerClassName="lg:grid-cols-[1fr_minmax(0,690px)]"
      />
      <div id="programs" className="scroll-mt-28" />
      <ProgramCards />
      <ProgramsCustom />
      <FinalCta />
    </>
  );
}
