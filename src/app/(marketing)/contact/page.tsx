import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactBooking } from "@/components/site/contact/booking";

export const metadata: Metadata = {
  title: "Contact — Vajira Weerasekera",
  description:
    "Book a 30-minute conversation to explore executive coaching, speaking, or advisory.",
};

export default function ContactPage() {
  return (
    <>
      {/* Custom Immersive Editorial Hero */}
      <section className="relative overflow-hidden bg-slate-50 pt-32 pb-16 lg:pt-48">
        {/* Ambient Canvas */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-40 right-[-10%] w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          
          {/* Left Column: Typography & CTAs */}
          <div className="relative z-20 flex flex-col items-start justify-center text-left lg:pr-8">
            <span className="mb-6 block opacity-0 animate-fade-in-up text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-slate-500 [animation-delay:100ms]">
              START WITH A 30-MINUTE CONVERSATION
            </span>
            
            <h1 className="opacity-0 animate-fade-in-up text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.05] [animation-delay:200ms]">
              Book the call. We&apos;ll take it from{" "}
              <span className="font-serif italic font-normal text-blue-600">there.</span>
            </h1>

            <p className="mt-8 max-w-xl opacity-0 animate-fade-in-up text-lg md:text-xl text-slate-600 leading-relaxed [animation-delay:300ms]">
              A 30-minute conversation to understand where you are, where you want to lead from, and whether working together is the right fit.
            </p>

            <div className="mt-10 opacity-0 animate-fade-in-up [animation-delay:400ms]">
              <Link
                href="#book"
                className="inline-flex bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:scale-105 hover:bg-blue-600 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-300"
              >
                BOOK YOUR CALL
              </Link>
            </div>
          </div>
          
          {/* Right Column: Portrait Integration */}
          <div className="relative z-10 w-full max-w-lg mx-auto md:ml-auto opacity-0 animate-fade-in-scale [animation-delay:200ms]">
            {/* Decorative rings, matching the homepage hero motif */}
            <div className="absolute -inset-6 -z-10 rounded-full border border-blue-500/15" aria-hidden="true" />
            <div className="absolute -inset-14 -z-10 hidden rounded-full border border-blue-500/10 sm:block" aria-hidden="true" />

            <Image
              src="/home/contact-portrait.png"
              alt="Vajira Weerasekara"
              width={800}
              height={800}
              priority
              className="w-full h-auto object-contain drop-shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          
        </div>
      </section>

      <ContactBooking />
    </>
  );
}
