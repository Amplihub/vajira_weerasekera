"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PremiumCalendar } from "@/components/site/contact/premium-calendar";

const steps = [
  { num: "01", label: "Book a time" },
  { num: "02", label: "Strategic alignment" },
  { num: "03", label: "Define next steps" },
];

export function ContactBooking() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start lg:gap-24">
          
          {/* Left Column: Process & Trust */}
          <div className="flex flex-col gap-16">
            
            {/* The "Three Steps" - Naked Architectural Grid */}
            <div className="flex flex-col gap-8">
              <h2 className="font-sans text-3xl font-bold tracking-tight text-slate-900">
                Three steps. No surprises.
              </h2>
              <div className="flex flex-col gap-6 border-l border-slate-200 pl-4">
                {steps.map(({ num, label }) => (
                  <div key={num} className="flex items-center gap-4">
                    <span className="font-serif italic font-normal text-blue-600 text-lg">
                      {num}
                    </span>
                    <span className="font-sans font-bold text-slate-900 text-lg tracking-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credibility Text */}
            <div className="flex flex-col gap-8">
              <h3 className="font-sans text-2xl font-bold tracking-tight text-slate-900 leading-snug">
                30+ years leading across Microsoft, Red Hat, and global tech. Harvard-trained.
              </h3>

              {/* The Naked Logos */}
              <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
                <Image
                  src="/home/logos/microsoft.svg"
                  alt="Microsoft"
                  width={228}
                  height={63}
                  className="h-6 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                <Image
                  src="/home/logos/harvard.png"
                  alt="Harvard Business School"
                  width={120}
                  height={44}
                  className="h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                <Image
                  src="/home/logos/redhat.svg"
                  alt="Red Hat"
                  width={205}
                  height={49}
                  className="h-7 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </div>

            {/* Editorial Blockquote */}
            <div className="flex flex-col gap-6 mt-8">
              <blockquote className="border-l-2 border-blue-600 pl-6">
                <p className="font-serif text-xl italic leading-relaxed text-slate-600">
                  &ldquo;Vajira is a thoughtful and diligent leader who consistently demonstrated a high degree of ownership, treating our shared goals with the same care as if they were his own. His warm and collaborative nature makes him an exceptional partner. It was a pleasure to work with him.&rdquo;
                </p>
              </blockquote>
              <div className="flex items-center gap-4 pl-6">
                <div className="size-12 shrink-0 overflow-hidden rounded-full bg-slate-100">
                  <Image src="/home/testimonials/gunnar-hellekson.png" alt="Gunnar Hellekson" width={48} height={48} className="size-full object-cover grayscale" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Gunnar Hellekson</span>
                  <span className="text-sm text-slate-500">VP & GM, Linux, Red Hat</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Calendar & Links */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-32" id="book">
            
            {/* Custom Interactive Premium Calendar */}
            <PremiumCalendar />
            
            {/* Secondary Editorial Links */}
            <div className="flex flex-col gap-4 pl-2">
              <Link href="/speaking#enquiry" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Looking to book a keynote?
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a href="mailto:hello@vajiraweerasekera.com" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Not ready to book? Send an email
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
