import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ContactBooking } from "@/components/site/contact/booking";

export const metadata: Metadata = {
  title: "Contact — Vajira Weerasekera",
  description:
    "Book a 30-minute conversation to explore executive coaching, speaking, or advisory.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        skySrc={null}
        className="bg-[#eef3fb]"
        eyebrow="Start with a 30-minute conversation"
        title={
          <span className="flex flex-col">
            <span className="text-brand-blue">Book the call.</span>
            <span>We&apos;ll take it from there.</span>
          </span>
        }
        subtext="A 30-minute conversation to understand where you are, where you want to lead from, and whether working together is the right fit."
        ctas={[{ label: "Book your call", href: "#book" }]}
        image={{
          src: "/home/contact-portrait.png",
          alt: "Vajira Weerasekara",
          sizes: "420px",
        }}
        containerClassName="lg:grid-cols-[1fr_minmax(0,420px)]"
        imageWrapClassName="max-w-[420px] aspect-[3/4]"
        imageClassName="object-contain object-bottom"
      />

      <ContactBooking />
    </>
  );
}
