import type { Metadata } from "next";
import Image from "next/image";
import { Check, Lightbulb, MessagesSquare } from "lucide-react";
import { CtaButton } from "@/components/site/cta-button";

export const metadata: Metadata = { title: "Thank You — Vajira Weerasekera", robots: { index: false } };

const steps = [
  { icon: Check, label: "Confirm the booking" },
  { icon: Lightbulb, label: "One question to think about" },
  { icon: MessagesSquare, label: "A real conversation" },
];

export default function ThankYouPage() {
  return (
    <>
      <section className="px-6 pb-16 pt-36 sm:px-12 lg:px-[236px] lg:pb-[70px] lg:pt-[150px]">
        <div className="flex flex-col items-start gap-14">
          <div className="flex flex-col items-start gap-8">
            <div className="size-[100px] overflow-hidden rounded-full border-2 border-brand-navy/50 bg-brand-navy">
              <Image
                src="/brand/vajira-avatar.png"
                alt="Vajira Weerasekara"
                width={100}
                height={100}
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-12">
              <h1 className="font-heading text-4xl font-semibold leading-none tracking-[-1.5px] text-brand-ink sm:text-5xl lg:text-[60px]">
                Thank you. <span className="text-brand-blue">You&apos;re on the calendar.</span>
              </h1>
              <p className="max-w-2xl text-base leading-6 text-brand-ink/70">
                We will call you within 24 hours to talk through how we can help. No pressure, just a friendly chat.
              </p>
            </div>
          </div>
          <CtaButton href="/">Go back home</CtaButton>
        </div>
      </section>

      <section className="flex flex-col gap-12 bg-brand-blue/5 px-6 py-16 sm:px-12 lg:px-[236px] lg:py-[70px]">
        <h2 className="font-heading text-3xl font-semibold tracking-[-0.25px] text-brand-ink sm:text-[40px]">
          What to expect
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          {steps.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-1 flex-col gap-4 rounded-2xl border border-black/20 bg-white px-8 pb-10 pt-8"
            >
              <span className="flex w-fit items-center rounded-full bg-[#d27300]/5 p-2">
                <Icon className="size-6 text-[#d27300]" strokeWidth={1.75} />
              </span>
              <p className="font-heading text-2xl font-normal leading-8 tracking-[-0.15px] text-brand-ink sm:text-[32px]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
