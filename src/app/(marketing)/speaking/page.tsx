import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { SpeakingIntroVideo } from "@/components/site/speaking/intro-video";
import { SpeakingKeynotes } from "@/components/site/speaking/keynotes";
import { SpeakingRecentStages } from "@/components/site/speaking/recent-stages";
import { FormEmbedSection } from "@/components/site/form-embed-section";
import { FinalCta } from "@/components/site/home/final-cta";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

export const metadata: Metadata = {
  title: "Keynote Speaking — Vajira Weerasekera",
  description:
    "Keynotes on leadership in the AI era from a speaker who has led global teams at Microsoft and Red Hat across 14 countries.",
};

export default function SpeakingPage() {
  return (
    <>
      <PageHero
        eyebrow="Spoken at Asia Red Hat Summit, EY, and Asian Leadership Project"
        title={
          <>
            Book a <span className="text-brand-blue">keynote</span> your senior
            audience will actually use back at work.
          </>
        }
        subtext="Vajira spent 30 years making leadership calls at Microsoft, Red Hat, and across 14 countries. He brings that experience to the stage, so your audience leaves with practical thinking they can apply at work."
        ctas={[
          { label: "Enquire about a keynote", href: "#enquiry" },
          { label: "View my keynotes", href: "#keynotes", variant: "outline" },
        ]}
        image={{
          src: "/home/speaking-portrait.png",
          alt: "Vajira Weerasekara speaking",
          sizes: "690px",
        }}
        containerClassName="lg:grid-cols-[1fr_minmax(0,690px)]"
      />
      <SpeakingIntroVideo />
      <div id="keynotes" className="scroll-mt-28" />
      <SpeakingKeynotes />
      <SpeakingRecentStages />
      <FormEmbedSection
        id="enquiry"
        eyebrow="Speaking enquiry"
        title={
          <>
            Bring Vajira to your <span className="text-brand-blue">stage</span>.
          </>
        }
        subtext="Share your event, audience, and date — we'll come back to you with availability and fit."
        src={process.env.NEXT_PUBLIC_GHL_SPEAKING_URL}
        label="Speaking enquiry form"
        envName="NEXT_PUBLIC_GHL_SPEAKING_URL"
      />
      <FinalCta />
    </>
  );
}
