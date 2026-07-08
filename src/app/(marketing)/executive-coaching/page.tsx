import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CoachingMoments } from "@/components/site/coaching/moments";
import { CoachingEngage } from "@/components/site/coaching/engage";
import { CoachingHowItWorks } from "@/components/site/coaching/how-it-works";
import { CoachingExperience } from "@/components/site/coaching/experience";
import { CoachingFaq } from "@/components/site/coaching/faq";
import { FormEmbedSection } from "@/components/site/form-embed-section";
import { FinalCta } from "@/components/site/home/final-cta";

export const metadata: Metadata = {
  title: "Executive Coaching — Vajira Weerasekera",
  description:
    "One-to-one executive coaching for senior leaders. Real pushback from someone who has led global teams at Microsoft and Red Hat.",
};

export default function ExecutiveCoachingPage() {
  return (
    <>
      <PageHero
        eyebrow="Spoken at Asia Red Hat Summit, EY, and Asian Leadership Project"
        title={
          <>
            Get <span className="text-brand-blue"> coached </span> by someone
            who&apos;s actually sat in your chair.
          </>
        }
        subtext="Microsoft CTO, Red Hat VP, 14 countries — and gives you real pushback instead of polite reflection."
        ctas={[
          { label: "Apply for coaching", href: "#apply" },
          {
            label: "View coaching sessions",
            href: "#sessions",
            variant: "outline",
          },
        ]}
        image={{
          src: "/home/coaching-portrait.png",
          alt: "Vajira Weerasekara",
          sizes: "690px",
        }}
        containerClassName="lg:grid-cols-[1fr_minmax(0,690px)]"
      />
      <CoachingMoments />
      <div id="sessions" className="scroll-mt-28" />
      <CoachingEngage />
      <CoachingHowItWorks />
      <CoachingExperience />
      <CoachingFaq />
      <FormEmbedSection
        id="apply"
        eyebrow="Coaching application"
        title={
          <>
            Apply to work with <span className="text-brand-blue">Vajira</span>.
          </>
        }
        subtext="A few questions about where you are and what you want to shift. If it's a fit, we'll set up a call."
        src={process.env.NEXT_PUBLIC_GHL_APPLICATION_URL}
        label="Coaching application form"
        envName="NEXT_PUBLIC_GHL_APPLICATION_URL"
        height={900}
      />
      <FinalCta />
    </>
  );
}
