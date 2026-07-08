import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BOOK_CALL_HREF } from "@/lib/site-nav";

export function EmergingApplyCta() {
  return (
    <section className="bg-brand-navy">
      <div className="mx-auto flex max-w-[1664px] flex-col gap-12 px-6 py-20 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-[128px] lg:py-[120px]">
        <div className="flex flex-col gap-10">
          <div className="size-20 overflow-hidden rounded-2xl bg-white/5">
            <Image src="/brand/vajira-avatar.png" alt="Vajira Weerasekara" width={80} height={80} className="size-full object-cover" />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-3xl font-semibold leading-[1.1] tracking-[-0.5px] sm:text-5xl">
              <span className="text-white">Ready To Lead At The Next Level?</span>
              <br />
              <span className="text-white/50">Apply For The Program</span>
            </h2>
            <p className="max-w-2xl text-base leading-7 text-white/70">
              Applications take five minutes, are reviewed individually, and we&apos;ll be in touch within a few days to
              confirm a fit.
            </p>
          </div>
        </div>

        <Link
          href={BOOK_CALL_HREF}
          className="inline-flex h-14 w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-white/40 px-8 text-sm font-semibold uppercase tracking-[0.25px] text-white transition-colors hover:bg-white/10"
        >
          Book your call <ArrowUpRight className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
