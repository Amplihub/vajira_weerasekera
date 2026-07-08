import type { Metadata } from "next";
import { EmergingHero } from "@/components/site/emerging/hero";
import { EmergingAbout } from "@/components/site/emerging/about";
import { EmergingWhoWhat } from "@/components/site/emerging/who-what";
import { EmergingProgramContent } from "@/components/site/emerging/program-content";
import { EmergingApplyCta } from "@/components/site/emerging/apply-cta";

export const metadata: Metadata = {
  title: "Emerging Leaders Program — Vajira Weerasekera",
  description:
    "A 12-week cohort program to make the shift from operational manager to strategic leader.",
};

export default function EmergingLeadersPage() {
  return (
    <>
      <EmergingHero />
      <EmergingAbout />
      <EmergingWhoWhat />
      <EmergingProgramContent />
      <EmergingApplyCta />
    </>
  );
}
